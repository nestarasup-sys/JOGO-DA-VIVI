import {
  BookOpen, CalendarDays, Camera, Gamepad2, Map, MessageCircle,
  Save, Settings, Shirt, Sparkles, Wrench
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { ScreenId } from '../types/game';

const nav: Array<{ id: ScreenId; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'game', label: 'História', icon: Gamepad2 },
  { id: 'episodes', label: 'Episódios', icon: BookOpen },
  { id: 'phone', label: 'Celular', icon: MessageCircle },
  { id: 'map', label: 'Mapa', icon: Map },
  { id: 'events', label: 'Eventos', icon: CalendarDays },
  { id: 'wardrobe', label: 'Looks', icon: Shirt },
  { id: 'gallery', label: 'Galeria', icon: Camera },
  { id: 'saves', label: 'Saves', icon: Save },
  { id: 'studio', label: 'Studio', icon: Wrench },
  { id: 'settings', label: 'Opções', icon: Settings }
];

export function TopNav() {
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);
  const lumens = useGameStore((s) => s.lumens);
  const day = useGameStore((s) => s.day);
  const period = useGameStore((s) => s.period);
  const unread = useGameStore((s) => s.messages.filter((m) => !m.read).length);

  return (
    <header className="topnav">
      <button className="brand-button" onClick={() => setScreen('menu')}>
        <span className="brand-mark"><Sparkles size={18} /></span>
        <span><b>ENTRE NÓS</b><small>AURORA · V3 ULTRA</small></span>
      </button>
      <nav className="nav-scroll">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            title={label}
            className={screen === id ? 'nav-button active' : 'nav-button'}
            onClick={() => setScreen(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {id === 'phone' && unread > 0 && <i className="notification-dot">{unread}</i>}
          </button>
        ))}
      </nav>
      <div className="resource-bar">
        <span>Dia {day} · {period}</span>
        <strong>✦ {lumens}</strong>
      </div>
    </header>
  );
}
