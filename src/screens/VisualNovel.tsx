import { AnimatePresence, motion } from 'framer-motion';
import { History, Pause, Play, SkipForward } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CharacterSprite } from '../components/CharacterSprite';
import { conditionsMet, getEpisode, getNode, interpolate } from '../engine/storyEngine';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function VisualNovel({ story }: { story: StoryData }) {
  const state = useGameStore();
  const [historyOpen, setHistoryOpen] = useState(false);
  const episode = getEpisode(story, state.currentEpisodeId) ?? story.episodes[0];
  const node = getNode(story, episode.id, state.currentNodeId) ?? episode.nodes[episode.startNode];
  const char = node.character ? story.characters[node.character] : undefined;
  const nextEpisode = story.episodes.find((e) => e.number === episode.number + 1);

  const conditionState = useMemo(() => ({
    affinities: state.affinities,
    traits: state.traits,
    lumens: state.lumens,
    flags: state.flags,
    route: state.route,
    completedEpisodes: state.completedEpisodes
  }), [state.affinities, state.traits, state.lumens, state.flags, state.route, state.completedEpisodes]);

  const recordAndMove = (to?: string) => {
    if (node.text) {
      state.pushHistory({
        speaker: node.speaker ? interpolate(node.speaker, state.playerName) : undefined,
        text: interpolate(node.text, state.playerName),
        episodeId: episode.id
      });
    }
    state.applyEffects(node.effects);
    if (to) state.setPosition(episode.id, to);
  };

  const advance = () => {
    if (node.type === 'choice') return;
    if (node.type === 'end') {
      state.completeEpisode(episode.id, nextEpisode?.id);
      return;
    }
    recordAndMove(node.next);
  };

  const choose = (choice: NonNullable<typeof node.choices>[number]) => {
    if (!conditionsMet(choice.conditions, conditionState)) return;
    if (node.text) {
      state.pushHistory({ text: interpolate(node.text, state.playerName), episodeId: episode.id });
    }
    state.applyEffects(choice.effects);
    state.setPosition(episode.id, choice.to);
  };

  useEffect(() => {
    if (!state.autoMode || node.type === 'choice' || node.type === 'end') return;
    const timer = window.setTimeout(advance, state.settings.autoDelay);
    return () => window.clearTimeout(timer);
  }, [state.autoMode, state.currentNodeId, state.settings.autoDelay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && node.type !== 'choice') {
        e.preventDefault();
        advance();
      }
      if (e.key.toLowerCase() === 'h') setHistoryOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node.id, state.currentEpisodeId]);

  return (
    <section className="vn-screen" style={{ backgroundImage: `url("${node.background || episode.cover || ''}")` }}>
      <div className="vn-vignette" />
      <div className="episode-chip">EP {String(episode.number).padStart(2,'0')} · {episode.title}</div>
      <div className="route-chip">
        {state.route ? `Rota: ${state.route}` : 'Rota aberta'}
      </div>

      <AnimatePresence mode="wait">
        {char && (
          <motion.div
            key={`${char.id}-${node.expression}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: state.settings.reducedMotion ? 0 : .26 }}
          >
            <CharacterSprite character={char} expression={node.expression} position={node.position} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="vn-toolbar">
        <button onClick={() => setHistoryOpen(true)}><History size={18}/> Histórico</button>
        <button onClick={() => state.setAutoMode(!state.autoMode)}>
          {state.autoMode ? <Pause size={18}/> : <Play size={18}/>} Auto
        </button>
        <button onClick={advance} disabled={node.type === 'choice'}><SkipForward size={18}/> Avançar</button>
      </div>

      <motion.div
        key={node.id}
        className={node.type === 'choice' ? 'dialogue-box choice-box' : 'dialogue-box'}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => node.type !== 'choice' && advance()}
      >
        {node.speaker && <div className="speaker">{interpolate(node.speaker, state.playerName)}</div>}
        {node.text && <p>{interpolate(node.text, state.playerName)}</p>}

        {node.type === 'choice' && (
          <div className="choices">
            {node.choices?.map((choice) => {
              const unlocked = conditionsMet(choice.conditions, conditionState);
              return (
                <button
                  key={choice.id}
                  disabled={!unlocked}
                  className={unlocked ? '' : 'locked'}
                  onClick={(e) => { e.stopPropagation(); choose(choice); }}
                >
                  <span>{choice.label}</span>
                  {!unlocked && <small>🔒 Requisito ainda não atingido</small>}
                  {choice.hint && <small>{choice.hint}</small>}
                </button>
              );
            })}
          </div>
        )}

        {node.type === 'end' && (
          <button className="primary end-button" onClick={(e) => { e.stopPropagation(); advance(); }}>
            {nextEpisode ? 'Ir para o próximo episódio' : 'Concluir temporada'}
          </button>
        )}
        {node.type !== 'choice' && node.type !== 'end' && <span className="continue-mark">⌄</span>}
      </motion.div>

      {historyOpen && (
        <div className="modal-backdrop" onClick={() => setHistoryOpen(false)}>
          <aside className="history-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-title"><h2>Histórico</h2><button onClick={() => setHistoryOpen(false)}>×</button></div>
            <div className="history-list">
              {[...state.history].reverse().map((h) => (
                <article key={h.id}><b>{h.speaker}</b><p>{h.text}</p></article>
              ))}
              {!state.history.length && <p className="muted">O diálogo aparecerá aqui conforme você jogar.</p>}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
