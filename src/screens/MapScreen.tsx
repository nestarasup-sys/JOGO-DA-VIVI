import { Clock3, MapPin } from 'lucide-react';
import { conditionsMet } from '../engine/storyEngine';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function MapScreen({ story }: { story: StoryData }) {
  const s = useGameStore();
  const conditionState = {
    affinities: s.affinities, traits: s.traits, lumens: s.lumens,
    flags: s.flags, route: s.route, completedEpisodes: s.completedEpisodes
  };

  return (
    <section className="page-shell map-page">
      <div className="page-heading inline">
        <div><span className="eyebrow">EXPLORAÇÃO</span><h1>Mapa de Aurora</h1></div>
        <div className="time-card"><Clock3/> Dia {s.day} · {s.period}</div>
      </div>
      <div className="map-canvas">
        <div className="map-rings r1"/><div className="map-rings r2"/>
        {story.locations.filter((l) => conditionsMet(l.conditions, conditionState)).map((loc, index) => {
          const visited = s.visitedLocations[loc.id] === s.day;
          return (
            <button
              key={loc.id}
              className={visited ? `map-pin p${index+1} visited` : `map-pin p${index+1}`}
              onClick={() => s.visitLocation(loc.id, visited ? undefined : loc.reward)}
            >
              <span className="pin-icon">{loc.icon}</span>
              <span><b>{loc.name}</b><small>{visited ? 'Visitado hoje' : loc.description}</small></span>
              <MapPin size={16}/>
            </button>
          );
        })}
        <div className="map-label">AURORA<br/><small>cidade universitária</small></div>
      </div>
    </section>
  );
}
