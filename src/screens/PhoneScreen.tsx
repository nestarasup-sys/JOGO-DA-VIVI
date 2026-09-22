import { MessageCircle, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { StoryData } from '../types/game';

export function PhoneScreen({ story }: { story: StoryData }) {
  const store = useGameStore();
  const [active, setActive] = useState(story.threads[0]?.id ?? '');
  const [draft, setDraft] = useState('');

  const messages = useMemo(() => {
    const seed = story.threads.find((t) => t.id === active)?.initial.map((m, i) => ({
      id: `seed-${active}-${i}`, threadId: active, from: m.from, text: m.text,
      mine: !!m.mine, read: true, createdAt: i
    })) ?? [];
    return [...seed, ...store.messages.filter((m) => m.threadId === active)]
      .sort((a,b) => a.createdAt - b.createdAt);
  }, [active, story.threads, store.messages]);

  const thread = story.threads.find((t) => t.id === active);
  const character = thread ? story.characters[thread.characterId] : undefined;

  return (
    <section className="phone-page page-shell">
      <div className="phone-device">
        <aside className="thread-list">
          <div className="phone-title"><MessageCircle/> Aurora Chat</div>
          {story.threads.map((t) => {
            const unread = store.messages.filter((m) => m.threadId === t.id && !m.read).length;
            const c = story.characters[t.characterId];
            return (
              <button key={t.id} className={active === t.id ? 'thread active' : 'thread'}
                onClick={() => { setActive(t.id); store.markThreadRead(t.id); }}>
                <span className="mini-avatar" style={{ background: c?.accent }}>{t.displayName[0]}</span>
                <span><b>{t.displayName}</b><small>{unread ? `${unread} nova(s)` : 'online recentemente'}</small></span>
              </button>
            );
          })}
        </aside>
        <main className="chat-panel">
          <header>
            <span className="mini-avatar" style={{ background: character?.accent }}>{thread?.displayName[0]}</span>
            <div><b>{thread?.displayName}</b><small>{character?.shortBio}</small></div>
          </header>
          <div className="chat-messages">
            {messages.map((m) => (
              <div key={m.id} className={m.mine ? 'bubble mine' : 'bubble'}>
                <small>{m.mine ? store.playerName : m.from}</small>
                <p>{m.text.replaceAll('{player}', store.playerName)}</p>
              </div>
            ))}
          </div>
          <form className="chat-input" onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            store.sendMessage(active, draft.trim());
            setDraft('');
          }}>
            <input placeholder="Escrever mensagem..." value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button><Send size={18}/></button>
          </form>
        </main>
      </div>
    </section>
  );
}
