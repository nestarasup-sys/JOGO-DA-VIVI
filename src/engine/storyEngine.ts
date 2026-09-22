import type {
  Condition,
  Effect,
  GameSaveStateLike,
  StoryData,
  StoryNode
} from './storyEngineTypes';
import type { SaveSnapshot } from '../types/game';

export type ConditionState = Pick<
  SaveSnapshot,
  'affinities' | 'traits' | 'lumens' | 'flags' | 'route' | 'completedEpisodes'
>;

export function compare(left: unknown, op: Condition['op'] = '==', right: unknown): boolean {
  switch (op) {
    case '>=': return Number(left) >= Number(right);
    case '<=': return Number(left) <= Number(right);
    case '>': return Number(left) > Number(right);
    case '<': return Number(left) < Number(right);
    case '!=': return left !== right;
    case '==':
    default: return left === right;
  }
}

export function conditionMet(condition: Condition, state: ConditionState): boolean {
  if (condition.kind === 'flag') return compare(state.flags[condition.key ?? ''], condition.op, condition.value);
  if (condition.kind === 'affinity') return compare(state.affinities[condition.key as keyof typeof state.affinities], condition.op, condition.value);
  if (condition.kind === 'trait') return compare(state.traits[condition.key as keyof typeof state.traits], condition.op, condition.value);
  if (condition.kind === 'lumens') return compare(state.lumens, condition.op, condition.value);
  if (condition.kind === 'route') return compare(state.route, condition.op, condition.value);
  if (condition.kind === 'episodeComplete') return state.completedEpisodes.includes(String(condition.value));
  return false;
}

export function conditionsMet(conditions: Condition[] | undefined, state: ConditionState): boolean {
  return !conditions?.length || conditions.every((item) => conditionMet(item, state));
}

export function interpolate(text: string | undefined, playerName: string): string {
  if (!text) return '';
  return text.replaceAll('{player}', playerName || 'Vivi');
}

export function getEpisode(story: StoryData, episodeId: string) {
  return story.episodes.find((episode) => episode.id === episodeId);
}

export function getNode(story: StoryData, episodeId: string, nodeId: string): StoryNode | undefined {
  return getEpisode(story, episodeId)?.nodes[nodeId];
}

export function validateStory(story: StoryData): string[] {
  const errors: string[] = [];
  if (story.schemaVersion !== 3) errors.push('schemaVersion precisa ser 3.');
  if (!story.episodes?.length) errors.push('Nenhum episódio encontrado.');

  for (const episode of story.episodes ?? []) {
    if (!episode.nodes[episode.startNode]) {
      errors.push(`${episode.id}: startNode "${episode.startNode}" não existe.`);
    }

    const nodeIds = new Set(Object.keys(episode.nodes));
    for (const node of Object.values(episode.nodes)) {
      if (node.next && !nodeIds.has(node.next)) {
        errors.push(`${episode.id}/${node.id}: next "${node.next}" não existe.`);
      }
      for (const choice of node.choices ?? []) {
        if (!nodeIds.has(choice.to)) {
          errors.push(`${episode.id}/${node.id}: escolha "${choice.id}" aponta para "${choice.to}" inexistente.`);
        }
      }
    }
  }
  return errors;
}

// Tipos de compatibilidade mantidos aqui para o editor poder importar somente um módulo.
export type StoryEngineEffect = Effect;
export type StoryEngineState = GameSaveStateLike;
