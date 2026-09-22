import type { CharacterDef, Expression } from '../types/game';

const frames: Record<Expression, number> = {
  neutral: 0,
  smile: 1,
  serious: 2,
  angry: 3,
  blush: 4,
  surprised: 5
};

export function CharacterSprite({
  character,
  expression = 'neutral',
  position = 'center'
}: {
  character?: CharacterDef;
  expression?: Expression;
  position?: 'left' | 'center' | 'right';
}) {
  if (!character?.sheet) return null;
  const frame = frames[expression] ?? 0;
  return (
    <div className={`character-wrap character-${position}`} aria-label={character.name}>
      <div
        className="character-sprite"
        style={{
          backgroundImage: `url("${character.sheet}")`,
          backgroundPosition: `${frame * 20}% 50%`
        }}
      />
      <div className="character-glow" style={{ '--character-accent': character.accent } as React.CSSProperties} />
    </div>
  );
}
