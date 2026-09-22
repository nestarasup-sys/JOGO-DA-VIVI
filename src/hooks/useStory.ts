import { useEffect, useMemo, useState } from 'react';
import type { StoryData } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { validateStory } from '../engine/storyEngine';

export function useStory() {
  const override = useGameStore((s) => s.storyOverride);
  const [baseStory, setBaseStory] = useState<StoryData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/content/story.json', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`Falha ao carregar story.json (${r.status})`);
        return r.json();
      })
      .then((json: StoryData) => {
        const errors = validateStory(json);
        if (errors.length) throw new Error(errors.join('\n'));
        setBaseStory(json);
      })
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  const story = useMemo(() => {
    if (!override) return baseStory;
    try {
      const parsed = JSON.parse(override) as StoryData;
      return validateStory(parsed).length ? baseStory : parsed;
    } catch {
      return baseStory;
    }
  }, [baseStory, override]);

  return { story, loadError };
}
