import { motion } from 'framer-motion';
import { BookHeart, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function MainMenu() {
  const started = useGameStore((s) => s.started);
  const playerName = useGameStore((s) => s.playerName);
  const newGame = useGameStore((s) => s.newGame);
  const setScreen = useGameStore((s) => s.setScreen);
  const [name, setName] = useState(playerName || 'Vivi');

  return (
    <section className="menu-screen">
      <div className="menu-aurora" />
      <motion.div
        className="menu-copy"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .7 }}
      >
        <span className="eyebrow"><Sparkles size={16}/> VISUAL NOVEL ORIGINAL</span>
        <h1>Entre Nós:<br/><em>Aurora</em></h1>
        <p>
          Romance, amizade, ciúmes, mensagens de madrugada e decisões que mudam a forma
          como cada personagem enxerga você.
        </p>
        {!started && (
          <label className="name-field">
            <span>Nome da protagonista</span>
            <input value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          </label>
        )}
        <div className="menu-actions">
          {started ? (
            <button className="primary xl" onClick={() => setScreen('game')}>
              <Play size={20}/> Continuar história
            </button>
          ) : (
            <button className="primary xl" onClick={() => newGame(name)}>
              <Play size={20}/> Começar temporada
            </button>
          )}
          <button className="ghost xl" onClick={() => setScreen('episodes')}>
            <BookHeart size={20}/> Episódios
          </button>
        </div>
        <div className="menu-meta">
          <span>10 episódios</span><span>3 rotas</span><span>finais múltiplos</span><span>offline/PWA</span>
        </div>
      </motion.div>
      <div className="menu-portrait-card">
        <div className="portrait-stack p1" />
        <div className="portrait-stack p2" />
        <div className="portrait-stack p3" />
        <div className="menu-quote">“Algumas histórias começam com flores. A nossa começou com uma discussão.”</div>
      </div>
    </section>
  );
}
