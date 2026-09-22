import { Check, Lock, Shirt, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function WardrobeScreen({ story }: { story: StoryData }) {
  const s = useGameStore();
  return (
    <section className="page-shell wardrobe-page">
      <div className="page-heading inline"><div><span className="eyebrow">PERSONALIZAÇÃO</span><h1>Guarda-roupa</h1></div>
        <div className="lumens-card"><Sparkles/> {s.lumens} Lúmens</div>
      </div>
      <div className="wardrobe-layout">
        <div className="outfit-preview">
          <div className="outfit-silhouette">V</div>
          <span>Look atual</span>
          <h2>{story.outfits.find((o) => o.id === s.currentOutfit)?.name}</h2>
        </div>
        <div className="outfit-grid">
          {story.outfits.map((o) => {
            const owned = s.unlockedOutfits.includes(o.id);
            const active = s.currentOutfit === o.id;
            return <article className={active ? 'outfit-card active' : 'outfit-card'} key={o.id}>
              <div className="outfit-icon">{o.preview}</div>
              <div><small>{o.rarity}</small><h3>{o.name}</h3><p>{o.description}</p></div>
              <button disabled={!owned && s.lumens < o.price} onClick={() => owned ? s.setOutfit(o.id) : s.purchaseOutfit(o.id, o.price)}>
                {active ? <><Check/> Vestindo</> : owned ? <><Shirt/> Vestir</> : s.lumens >= o.price ? <>✦ {o.price}</> : <><Lock/> {o.price}</>}
              </button>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
