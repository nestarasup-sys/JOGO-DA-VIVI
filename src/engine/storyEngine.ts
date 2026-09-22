import type { Condition, Effect, SaveSnapshot, StoryData, StoryNode } from '../types/game';

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
      continue;
    }

    const nodeIds = new Set(Object.keys(episode.nodes));
    let hasEnd = false;
    for (const [key, node] of Object.entries(episode.nodes)) {
      if (node.id !== key) errors.push(`${episode.id}/${key}: id interno "${node.id}" difere da chave.`);
      if (node.type === 'end') hasEnd = true;
      if (node.next && !nodeIds.has(node.next)) {
        errors.push(`${episode.id}/${node.id}: next "${node.next}" não existe.`);
      }
      if (node.type === 'choice' && !node.choices?.length) {
        errors.push(`${episode.id}/${node.id}: choice sem opções.`);
      }
      for (const choice of node.choices ?? []) {
        if (!nodeIds.has(choice.to)) {
          errors.push(`${episode.id}/${node.id}: escolha "${choice.id}" aponta para "${choice.to}" inexistente.`);
        }
      }
    }
    if (!hasEnd) errors.push(`${episode.id}: episódio não possui node do tipo end.`);
  }
  return errors;
}

export type StoryEngineEffect = Effect;
export type StoryEngineState = SaveSnapshot;
