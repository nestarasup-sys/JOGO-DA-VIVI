import { CheckCircle2, LockKeyhole, Play } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function EpisodeScreen({ story }: { story: StoryData }) {
  const completed = useGameStore((s) => s.completedEpisodes);
  const currentEpisodeId = useGameStore((s) => s.currentEpisodeId);
  const setPosition = useGameStore((s) => s.setPosition);
  const setScreen = useGameStore((s) => s.setScreen);

  const highest = Math.max(1, ...story.episodes.map((e) =>
    completed.includes(e.id) || e.id === currentEpisodeId ? e.number : 0
  ));

  return (
    <section className="page-shell">
      <div className="page-heading">
        <span className="eyebrow">TEMPORADA 01</span>
        <h1>Episódios</h1>
        <p>Rejogue capítulos para explorar outras respostas sem apagar seus desbloqueios globais.</p>
      </div>
      <div className="episode-grid">
        {story.episodes.map((ep) => {
          const unlocked = ep.number <= highest + 1;
          const done = completed.includes(ep.id);
          return (
            <article className={unlocked ? 'episode-card' : 'episode-card locked-card'} key={ep.id}>
              <div className="episode-cover" style={{ backgroundImage: `url("${ep.cover}")` }}>
                <span>EP {String(ep.number).padStart(2,'0')}</span>
                {done ? <CheckCircle2 size={24}/> : !unlocked ? <LockKeyhole size={24}/> : null}
              </div>
              <div className="episode-body">
                <small>{ep.subtitle}</small>
                <h3>{ep.title}</h3>
                <p>{ep.synopsis}</p>
                <button
                  disabled={!unlocked}
                  onClick={() => {
                    setPosition(ep.id, ep.startNode);
                    setScreen('game');
                  }}
                >
                  <Play size={16}/> {done ? 'Rejogar' : ep.id === currentEpisodeId ? 'Continuar' : 'Jogar'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
