import { CheckCircle2, Gift, Sparkles } from 'lucide-react';
import { conditionsMet } from '../engine/storyEngine';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function EventScreen({ story }: { story: StoryData }) {
  const s = useGameStore();
  const cs = { affinities:s.affinities, traits:s.traits, lumens:s.lumens, flags:s.flags, route:s.route, completedEpisodes:s.completedEpisodes };
  return (
    <section className="page-shell">
      <div className="page-heading"><span className="eyebrow">CONTEÚDO EXTRA</span><h1>Eventos</h1>
        <p>Pequenas cenas e recompensas aparecem conforme seus relacionamentos evoluem.</p></div>
      <div className="event-grid">
        {story.events.map((event) => {
          const available = conditionsMet(event.conditions, cs);
          const claimed = s.flags[`event_claimed_${event.id}`] === true;
          return (
            <article className={available ? 'event-card' : 'event-card unavailable'} key={event.id}>
              <div className="event-banner"><span>{event.banner}</span><Sparkles/></div>
              <div className="event-copy"><small>{available ? 'DISPONÍVEL' : 'BLOQUEADO'}</small><h2>{event.title}</h2><p>{event.description}</p>
                <button disabled={!available || claimed} onClick={() => {
                  s.applyEffects(event.effects);
                  s.applyEffects([{ type:'flag', key:`event_claimed_${event.id}`, value:true }]);
                }}>
                  {claimed ? <><CheckCircle2/> Resgatado</> : <><Gift/> Participar / resgatar</>}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
