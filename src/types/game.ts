export type RouteId = 'gael' | 'leon' | 'ravi' | 'independent' | null;
export type LoveInterestId = 'gael' | 'leon' | 'ravi';
export type TraitId = 'empathy' | 'courage' | 'humor';
export type Period = 'morning' | 'afternoon' | 'evening' | 'night';
export type Expression = 'neutral' | 'smile' | 'serious' | 'angry' | 'blush' | 'surprised';
export type ScreenId =
  | 'menu'
  | 'game'
  | 'episodes'
  | 'phone'
  | 'map'
  | 'gallery'
  | 'wardrobe'
  | 'events'
  | 'studio'
  | 'saves'
  | 'settings';

export interface CharacterDef {
  id: string;
  name: string;
  shortBio: string;
  accent: string;
  sheet?: string;
  expressions?: Expression[];
}

export interface Condition {
  kind: 'flag' | 'affinity' | 'trait' | 'route' | 'lumens' | 'episodeComplete';
  key?: string;
  op?: '>=' | '<=' | '>' | '<' | '==' | '!=';
  value: string | number | boolean;
}

export type Effect =
  | { type: 'affinity'; target: LoveInterestId; amount: number }
  | { type: 'trait'; target: TraitId; amount: number }
  | { type: 'currency'; amount: number }
  | { type: 'flag'; key: string; value: string | number | boolean }
  | { type: 'unlockCg'; id: string }
  | { type: 'unlockOutfit'; id: string }
  | { type: 'message'; threadId: string; from: string; text: string }
  | { type: 'route'; value: RouteId }
  | { type: 'achievement'; id: string }
  | { type: 'advanceTime'; steps?: number };

export interface ChoiceDef {
  id: string;
  label: string;
  to: string;
  effects?: Effect[];
  conditions?: Condition[];
  hint?: string;
}

export interface StoryNode {
  id: string;
  type: 'dialogue' | 'narration' | 'choice' | 'end';
  speaker?: string;
  text?: string;
  background?: string;
  character?: string;
  expression?: Expression;
  position?: 'left' | 'center' | 'right';
  next?: string;
  choices?: ChoiceDef[];
  effects?: Effect[];
  conditions?: Condition[];
  endCard?: string;
}

export interface EpisodeDef {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  synopsis: string;
  startNode: string;
  cover?: string;
  nodes: Record<string, StoryNode>;
}

export interface MessageSeed {
  id: string;
  from: string;
  text: string;
  mine?: boolean;
  at?: string;
}

export interface ThreadDef {
  id: string;
  characterId: string;
  displayName: string;
  avatar?: string;
  initial: MessageSeed[];
}

export interface LocationDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  background?: string;
  reward?: Effect[];
  oncePerDay?: boolean;
  conditions?: Condition[];
}

export interface CgDef {
  id: string;
  title: string;
  description: string;
  src: string;
  route?: LoveInterestId | 'general';
}

export interface OutfitDef {
  id: string;
  name: string;
  description: string;
  price: number;
  preview: string;
  rarity: 'common' | 'rare' | 'epic';
}

export interface EventDef {
  id: string;
  title: string;
  description: string;
  banner: string;
  conditions?: Condition[];
  effects?: Effect[];
}

export interface StoryData {
  schemaVersion: 3;
  title: string;
  version: string;
  characters: Record<string, CharacterDef>;
  episodes: EpisodeDef[];
  threads: ThreadDef[];
  locations: LocationDef[];
  cgs: CgDef[];
  outfits: OutfitDef[];
  events: EventDef[];
}

export interface PhoneMessage {
  id: string;
  threadId: string;
  from: string;
  text: string;
  mine: boolean;
  read: boolean;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  speaker?: string;
  text: string;
  episodeId: string;
}

export interface GameSettings {
  textSpeed: 'instant' | 'fast' | 'normal' | 'slow';
  autoDelay: number;
  reducedMotion: boolean;
  highContrast: boolean;
  masterVolume: number;
}

export interface SaveSnapshot {
  schemaVersion: 3;
  savedAt: number;
  playerName: string;
  started: boolean;
  currentEpisodeId: string;
  currentNodeId: string;
  affinities: Record<LoveInterestId, number>;
  traits: Record<TraitId, number>;
  lumens: number;
  flags: Record<string, string | number | boolean>;
  unlockedCgs: string[];
  unlockedOutfits: string[];
  currentOutfit: string;
  messages: PhoneMessage[];
  route: RouteId;
  day: number;
  period: Period;
  completedEpisodes: string[];
  visitedLocations: Record<string, number>;
  achievements: string[];
  history: HistoryEntry[];
}
