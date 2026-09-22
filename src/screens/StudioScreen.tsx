import { CheckCircle2, Download, RotateCcw, Save, Upload, Wrench, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { validateStory } from '../engine/storyEngine';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function StudioScreen({ story }: { story: StoryData }) {
  const stored = useGameStore((s) => s.storyOverride);
  const setOverride = useGameStore((s) => s.setStoryOverride);
  const [raw, setRaw] = useState(stored ?? JSON.stringify(story,null,2));
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef=useRef<HTMLInputElement>(null);

  useEffect(() => { if(!stored) setRaw(JSON.stringify(story,null,2)); }, [story.version]);

  const inspect=(value=raw) => {
    try {
      const parsed=JSON.parse(value) as StoryData;
      const found=validateStory(parsed);
      setErrors(found);
      return found.length===0 ? parsed : null;
    } catch(e) {
      setErrors([(e as Error).message]);
      return null;
    }
  };

  const save=() => {
    const parsed=inspect();
    if(!parsed) return;
    setOverride(JSON.stringify(parsed));
  };

  const download=() => {
    const parsed=inspect(); if(!parsed) return;
    const blob=new Blob([JSON.stringify(parsed,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download='story-v3-edited.json'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="studio-page page-shell">
      <div className="page-heading inline">
        <div><span className="eyebrow"><Wrench size={14}/> AURORA STUDIO</span><h1>Editor de história</h1><p>Edite a campanha sem recompilar o motor. O override fica salvo localmente.</p></div>
        <div className="studio-actions">
          <button onClick={() => inspect()}><CheckCircle2/> Validar</button>
          <button onClick={save} className="primary"><Save/> Aplicar no jogo</button>
          <button onClick={download}><Download/> Exportar</button>
          <button onClick={() => inputRef.current?.click()}><Upload/> Importar</button>
          <button onClick={() => { setOverride(null); setRaw(JSON.stringify(story,null,2)); setErrors([]); }}><RotateCcw/> Base</button>
        </div>
      </div>
      <input hidden ref={inputRef} type="file" accept=".json,application/json" onChange={async(e)=>{
        const f=e.target.files?.[0]; if(!f)return; const text=await f.text(); setRaw(text); inspect(text); e.currentTarget.value='';
      }}/>
      <div className="studio-layout">
        <aside className="studio-help">
          <h3>Schema V3</h3>
          <code>episodes[].nodes</code>
          <p>Tipos: <b>narration</b>, <b>dialogue</b>, <b>choice</b>, <b>end</b>.</p>
          <code>effects[]</code>
          <p>afinidade, trait, currency, flag, unlockCg, unlockOutfit, message, route, achievement e advanceTime.</p>
          <code>conditions[]</code>
          <p>flag, affinity, trait, route, lumens e episodeComplete.</p>
          <div className={errors.length ? 'validation bad' : 'validation good'}>
            {errors.length ? <XCircle/> : <CheckCircle2/>}
            <span>{errors.length ? `${errors.length} erro(s)` : 'Sem erros detectados'}</span>
          </div>
          {errors.slice(0,8).map((err)=><small className="studio-error" key={err}>{err}</small>)}
        </aside>
        <textarea spellCheck={false} value={raw} onChange={(e)=>setRaw(e.target.value)} onBlur={()=>inspect()} />
      </div>
    </section>
  );
}
