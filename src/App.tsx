import { TopNav } from './components/TopNav';
import { useStory } from './hooks/useStory';
import { useGameStore } from './store/gameStore';
import { EpisodeScreen } from './screens/EpisodeScreen';
import { EventScreen } from './screens/EventScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { MainMenu } from './screens/MainMenu';
import { MapScreen } from './screens/MapScreen';
import { PhoneScreen } from './screens/PhoneScreen';
import { SavesScreen } from './screens/SavesScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StudioScreen } from './screens/StudioScreen';
import { VisualNovel } from './screens/VisualNovel';
import { WardrobeScreen } from './screens/WardrobeScreen';

export function App() {
  const screen=useGameStore((s)=>s.screen);
  const settings=useGameStore((s)=>s.settings);
  const {story,loadError}=useStory();

  if(loadError) return <div className="fatal-screen"><h1>Falha ao iniciar Aurora</h1><pre>{loadError}</pre><p>Execute <code>npm run validate:story</code> para diagnosticar o conteúdo.</p></div>;
  if(!story) return <div className="loading-screen"><div className="aurora-loader"/><b>Carregando Aurora…</b></div>;

  const content=(()=>{
    switch(screen){
      case 'menu': return <MainMenu/>;
      case 'game': return <VisualNovel story={story}/>;
      case 'episodes': return <EpisodeScreen story={story}/>;
      case 'phone': return <PhoneScreen story={story}/>;
      case 'map': return <MapScreen story={story}/>;
      case 'gallery': return <GalleryScreen story={story}/>;
      case 'wardrobe': return <WardrobeScreen story={story}/>;
      case 'events': return <EventScreen story={story}/>;
      case 'studio': return <StudioScreen story={story}/>;
      case 'saves': return <SavesScreen/>;
      case 'settings': return <SettingsScreen/>;
      default: return <MainMenu/>;
    }
  })();

  return (
    <div className={settings.highContrast ? 'app high-contrast' : 'app'}>
      {screen!=='menu' && <TopNav/>}
      <main className={screen==='menu' ? 'app-main menu-main' : 'app-main'}>{content}</main>
    </div>
  );
}
