import { Accessibility, Gauge, Monitor, Volume2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function SettingsScreen() {
  const settings=useGameStore((s)=>s.settings);
  const setSettings=useGameStore((s)=>s.setSettings);
  return (
    <section className="page-shell settings-page">
      <div className="page-heading"><span className="eyebrow">PREFERÊNCIAS</span><h1>Configurações</h1></div>
      <div className="settings-grid">
        <article><Gauge/><div><h3>Auto Mode</h3><p>Intervalo entre falas no modo automático.</p><input type="range" min="1200" max="6000" step="100" value={settings.autoDelay} onChange={e=>setSettings({autoDelay:+e.target.value})}/><small>{(settings.autoDelay/1000).toFixed(1)}s</small></div></article>
        <article><Monitor/><div><h3>Velocidade do texto</h3><p>Preparado para o efeito typewriter do pipeline de polish.</p><select value={settings.textSpeed} onChange={e=>setSettings({textSpeed:e.target.value as typeof settings.textSpeed})}><option value="instant">Instantâneo</option><option value="fast">Rápido</option><option value="normal">Normal</option><option value="slow">Lento</option></select></div></article>
        <article><Accessibility/><div><h3>Movimento reduzido</h3><p>Remove animações de entrada e transições longas.</p><label className="switch"><input type="checkbox" checked={settings.reducedMotion} onChange={e=>setSettings({reducedMotion:e.target.checked})}/><span/></label></div></article>
        <article><Accessibility/><div><h3>Alto contraste</h3><p>Aumenta contraste dos painéis e controles.</p><label className="switch"><input type="checkbox" checked={settings.highContrast} onChange={e=>setSettings({highContrast:e.target.checked})}/><span/></label></div></article>
        <article><Volume2/><div><h3>Volume geral</h3><p>Reserva do mixer de áudio da trilha e efeitos.</p><input type="range" min="0" max="1" step=".05" value={settings.masterVolume} onChange={e=>setSettings({masterVolume:+e.target.value})}/><small>{Math.round(settings.masterVolume*100)}%</small></div></article>
      </div>
    </section>
  );
}
