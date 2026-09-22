import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Effect,
  GameSettings,
  HistoryEntry,
  LoveInterestId,
  Period,
  PhoneMessage,
  RouteId,
  SaveSnapshot,
  ScreenId,
  TraitId
} from '../types/game';

const periods: Period[] = ['morning', 'afternoon', 'evening', 'night'];

const defaultSettings: GameSettings = {
  textSpeed: 'normal',
  autoDelay: 2600,
  reducedMotion: false,
  highContrast: false,
  masterVolume: 0.8
};

const seedSnapshot = (): SaveSnapshot => ({
  schemaVersion: 3,
  savedAt: Date.now(),
  playerName: 'Vivi',
  started: false,
  currentEpisodeId: 'ep01',
  currentNodeId: 'start',
  affinities: { gael: 0, leon: 0, ravi: 0 },
  traits: { empathy: 0, courage: 0, humor: 0 },
  lumens: 250,
  flags: {},
  unlockedCgs: [],
  unlockedOutfits: ['casual-aurora'],
  currentOutfit: 'casual-aurora',
  messages: [],
  route: null,
  day: 1,
  period: 'morning',
  completedEpisodes: [],
  visitedLocations: {},
  achievements: [],
  history: []
});

export interface GameStore extends SaveSnapshot {
  screen: ScreenId;
  autoMode: boolean;
  manualSlots: Record<string, SaveSnapshot | null>;
  settings: GameSettings;
  storyOverride: string | null;
  setScreen: (screen: ScreenId) => void;
  setPlayerName: (name: string) => void;
  newGame: (name?: string) => void;
  setPosition: (episodeId: string, nodeId: string) => void;
  applyEffects: (effects?: Effect[]) => void;
  pushHistory: (entry: Omit<HistoryEntry, 'id'>) => void;
  completeEpisode: (episodeId: string, nextEpisodeId?: string) => void;
  markThreadRead: (threadId: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  visitLocation: (locationId: string, effects?: Effect[]) => boolean;
  purchaseOutfit: (id: string, price: number) => boolean;
  setOutfit: (id: string) => void;
  saveSlot: (slot: string) => void;
  loadSlot: (slot: string) => void;
  deleteSlot: (slot: string) => void;
  importSnapshot: (snapshot: SaveSnapshot) => void;
  setSettings: (settings: Partial<GameSettings>) => void;
  setAutoMode: (enabled: boolean) => void;
  setStoryOverride: (raw: string | null) => void;
}

function snapshotFrom(state: GameStore): SaveSnapshot {
  return {
    schemaVersion: 3,
    savedAt: Date.now(),
    playerName: state.playerName,
    started: state.started,
    currentEpisodeId: state.currentEpisodeId,
    currentNodeId: state.currentNodeId,
    affinities: { ...state.affinities },
    traits: { ...state.traits },
    lumens: state.lumens,
    flags: { ...state.flags },
    unlockedCgs: [...state.unlockedCgs],
    unlockedOutfits: [...state.unlockedOutfits],
    currentOutfit: state.currentOutfit,
    messages: [...state.messages],
    route: state.route,
    day: state.day,
    period: state.period,
    completedEpisodes: [...state.completedEpisodes],
    visitedLocations: { ...state.visitedLocations },
    achievements: [...state.achievements],
    history: [...state.history]
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...seedSnapshot(),
      screen: 'menu',
      autoMode: false,
      manualSlots: { '1': null, '2': null, '3': null },
      settings: defaultSettings,
      storyOverride: null,

      setScreen: (screen) => set({ screen }),
      setPlayerName: (playerName) => set({ playerName: playerName.trim() || 'Vivi' }),
      newGame: (name) => set({
        ...seedSnapshot(),
        playerName: name?.trim() || get().playerName || 'Vivi',
        started: true,
        screen: 'game'
      }),
      setPosition: (currentEpisodeId, currentNodeId) => set({ currentEpisodeId, currentNodeId, started: true }),
      applyEffects: (effects = []) => {
        for (const effect of effects) {
          const s = get();
          switch (effect.type) {
            case 'affinity':
              set({ affinities: { ...s.affinities, [effect.target]: Math.max(0, s.affinities[effect.target] + effect.amount) } });
              break;
            case 'trait':
              set({ traits: { ...s.traits, [effect.target]: Math.max(0, s.traits[effect.target] + effect.amount) } });
              break;
            case 'currency':
              set({ lumens: Math.max(0, s.lumens + effect.amount) });
              break;
            case 'flag':
              set({ flags: { ...s.flags, [effect.key]: effect.value } });
              break;
            case 'unlockCg':
              if (!s.unlockedCgs.includes(effect.id)) set({ unlockedCgs: [...s.unlockedCgs, effect.id] });
              break;
            case 'unlockOutfit':
              if (!s.unlockedOutfits.includes(effect.id)) set({ unlockedOutfits: [...s.unlockedOutfits, effect.id] });
              break;
            case 'message': {
              const message: PhoneMessage = {
                id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                threadId: effect.threadId,
                from: effect.from,
                text: effect.text,
                mine: false,
                read: false,
                createdAt: Date.now()
              };
              set({ messages: [...s.messages, message] });
              break;
            }
            case 'route':
              set({ route: effect.value });
              break;
            case 'achievement':
              if (!s.achievements.includes(effect.id)) set({ achievements: [...s.achievements, effect.id] });
              break;
            case 'advanceTime': {
              const steps = Math.max(1, effect.steps ?? 1);
              let idx = periods.indexOf(s.period);
              let day = s.day;
              for (let i = 0; i < steps; i += 1) {
                idx += 1;
                if (idx >= periods.length) {
                  idx = 0;
                  day += 1;
                }
              }
              set({ day, period: periods[idx] });
              break;
            }
          }
        }
      },
      pushHistory: (entry) => set((s) => ({
        history: [...s.history.slice(-199), { ...entry, id: `h-${Date.now()}-${Math.random().toString(36).slice(2)}` }]
      })),
      completeEpisode: (episodeId, nextEpisodeId) => set((s) => ({
        completedEpisodes: s.completedEpisodes.includes(episodeId) ? s.completedEpisodes : [...s.completedEpisodes, episodeId],
        currentEpisodeId: nextEpisodeId ?? s.currentEpisodeId,
        currentNodeId: nextEpisodeId ? 'start' : s.currentNodeId,
        screen: nextEpisodeId ? 'game' : 'episodes'
      })),
      markThreadRead: (threadId) => set((s) => ({
        messages: s.messages.map((m) => m.threadId === threadId ? { ...m, read: true } : m)
      })),
      sendMessage: (threadId, text) => set((s) => ({
        messages: [...s.messages, {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          threadId,
          from: s.playerName,
          text,
          mine: true,
          read: true,
          createdAt: Date.now()
        }]
      })),
      visitLocation: (locationId, effects) => {
        const s = get();
        if (s.visitedLocations[locationId] === s.day) return false;
        set({ visitedLocations: { ...s.visitedLocations, [locationId]: s.day } });
        get().applyEffects(effects);
        get().applyEffects([{ type: 'advanceTime', steps: 1 }]);
        return true;
      },
      purchaseOutfit: (id, price) => {
        const s = get();
        if (s.unlockedOutfits.includes(id)) {
          set({ currentOutfit: id });
          return true;
        }
        if (s.lumens < price) return false;
        set({
          lumens: s.lumens - price,
          unlockedOutfits: [...s.unlockedOutfits, id],
          currentOutfit: id
        });
        return true;
      },
      setOutfit: (currentOutfit) => {
        if (get().unlockedOutfits.includes(currentOutfit)) set({ currentOutfit });
      },
      saveSlot: (slot) => set((s) => ({ manualSlots: { ...s.manualSlots, [slot]: snapshotFrom(s) } })),
      loadSlot: (slot) => {
        const snap = get().manualSlots[slot];
        if (snap) set({ ...snap, screen: 'game' });
      },
      deleteSlot: (slot) => set((s) => ({ manualSlots: { ...s.manualSlots, [slot]: null } })),
      importSnapshot: (snapshot) => {
        if (snapshot?.schemaVersion !== 3) throw new Error('Save incompatível: esperado schemaVersion 3.');
        set({ ...snapshot, screen: 'game' });
      },
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setAutoMode: (autoMode) => set({ autoMode }),
      setStoryOverride: (storyOverride) => set({ storyOverride })
    }),
    {
      name: 'aurora-v3-ultra',
      version: 3
    }
  )
);
