import { Download, FolderOpen, Save, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { SaveSnapshot } from '../types/game';

function snapshot(s: ReturnType<typeof useGameStore.getState>): SaveSnapshot {
  return {
    schemaVersion:3, savedAt:Date.now(), playerName:s.playerName, started:s.started,
    currentEpisodeId:s.currentEpisodeId, currentNodeId:s.currentNodeId,
    affinities:{...s.affinities}, traits:{...s.traits}, lumens:s.lumens,
    flags:{...s.flags}, unlockedCgs:[...s.unlockedCgs], unlockedOutfits:[...s.unlockedOutfits],
    currentOutfit:s.currentOutfit, messages:[...s.messages], route:s.route, day:s.day, period:s.period,
    completedEpisodes:[...s.completedEpisodes], visitedLocations:{...s.visitedLocations},
    achievements:[...s.achievements], history:[...s.history]
  };
}

export function SavesScreen() {
  const s = useGameStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const exportSave = () => {
    const blob = new Blob([JSON.stringify(snapshot(useGameStore.getState()), null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `aurora-v3-save-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="page-shell">
      <div className="page-heading inline"><div><span className="eyebrow">PROGRESSO</span><h1>Central de saves</h1></div>
        <div className="save-actions"><button onClick={exportSave}><Download/> Exportar</button><button onClick={() => inputRef.current?.click()}><Upload/> Importar</button></div>
      </div>
      <input ref={inputRef} hidden type="file" accept=".json,application/json" onChange={async (e) => {
        const file=e.target.files?.[0]; if(!file) return;
        try { s.importSnapshot(JSON.parse(await file.text())); } catch(err) { alert((err as Error).message); }
        e.currentTarget.value='';
      }}/>
      <div className="save-grid">
        {['1','2','3'].map((slot) => {
          const snap=s.manualSlots[slot];
          return <article className="save-card" key={slot}>
            <div className="save-number">{slot}</div>
            {snap ? <><div><small>{new Date(snap.savedAt).toLocaleString()}</small><h2>{snap.playerName}</h2><p>{snap.currentEpisodeId.toUpperCase()} · Dia {snap.day} · ✦ {snap.lumens}</p></div>
              <div className="save-buttons"><button onClick={() => s.loadSlot(slot)}><FolderOpen/> Carregar</button><button onClick={() => s.saveSlot(slot)}><Save/> Sobrescrever</button><button className="danger" onClick={() => s.deleteSlot(slot)}><Trash2/></button></div></>
              : <><div><small>SLOT VAZIO</small><h2>Novo save</h2><p>Guarde o estado atual da sua história.</p></div><button onClick={() => s.saveSlot(slot)}><Save/> Salvar aqui</button></>}
          </article>;
        })}
      </div>
      <div className="backup-note"><b>Backup portátil.</b> Exportar cria um JSON independente do navegador. Você pode guardar esse arquivo, mandar para outro PC e importar depois.</div>
    </section>
  );
}
