import { LockKeyhole, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { CgDef, StoryData } from '../types/game';

export function GalleryScreen({ story }: { story: StoryData }) {
  const unlocked = useGameStore((s) => s.unlockedCgs);
  const [selected, setSelected] = useState<CgDef | null>(null);
  return (
    <section className="page-shell">
      <div className="page-heading"><span className="eyebrow">MEMÓRIAS</span><h1>Galeria de CGs</h1>
        <p>{unlocked.length} de {story.cgs.length} memórias desbloqueadas.</p></div>
      <div className="gallery-grid">
        {story.cgs.map((cg) => {
          const open = unlocked.includes(cg.id);
          return (
            <button className={open ? 'cg-card' : 'cg-card cg-locked'} key={cg.id} onClick={() => open && setSelected(cg)}>
              <div className="cg-image" style={{ backgroundImage: open ? `url("${cg.src}")` : undefined }}>
                {open ? <Maximize2/> : <LockKeyhole/>}
              </div>
              <div><small>{cg.route}</small><b>{open ? cg.title : 'Memória bloqueada'}</b><p>{open ? cg.description : 'Continue jogando para descobrir.'}</p></div>
            </button>
          );
        })}
      </div>
      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}>
        <div className="cg-modal" onClick={(e) => e.stopPropagation()}>
          <img src={selected.src} alt={selected.title}/><div><h2>{selected.title}</h2><p>{selected.description}</p><button onClick={() => setSelected(null)}>Fechar</button></div>
        </div>
      </div>}
    </section>
  );
}
