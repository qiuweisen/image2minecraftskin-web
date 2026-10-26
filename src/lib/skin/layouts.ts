import type { SkinFormat, SkinModel } from './types';

export type SkinRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  part: SkinPart;
};

export type SkinPart =
  | 'head'
  | 'torso'
  | 'right-arm'
  | 'left-arm'
  | 'right-leg'
  | 'left-leg';

type RegionCoordinates = Omit<SkinRegion, 'part'>;

function tag(part: SkinPart, regions: RegionCoordinates[]): SkinRegion[] {
  return regions.map((region) => ({ ...region, part }));
}

const HEAD = tag('head', [
  { x: 8, y: 0, width: 8, height: 8 },
  { x: 16, y: 0, width: 8, height: 8 },
  { x: 0, y: 8, width: 8, height: 8 },
  { x: 8, y: 8, width: 8, height: 8 },
  { x: 16, y: 8, width: 8, height: 8 },
  { x: 24, y: 8, width: 8, height: 8 },
]);

const TORSO = tag('torso', [
  { x: 20, y: 16, width: 8, height: 4 },
  { x: 28, y: 16, width: 8, height: 4 },
  { x: 16, y: 20, width: 4, height: 12 },
  { x: 20, y: 20, width: 8, height: 12 },
  { x: 28, y: 20, width: 4, height: 12 },
  { x: 32, y: 20, width: 8, height: 12 },
]);

function limb(
  part: SkinPart,
  x: number,
  y: number,
  width: number
): SkinRegion[] {
  return tag(part, [
    { x: x + 4, y, width, height: 4 },
    { x: x + 4 + width, y, width, height: 4 },
    { x, y: y + 4, width: 4, height: 12 },
    { x: x + 4, y: y + 4, width, height: 12 },
    { x: x + 4 + width, y: y + 4, width: 4, height: 12 },
    { x: x + 8 + width, y: y + 4, width, height: 12 },
  ]);
}

function javaRegions(model: SkinModel): SkinRegion[] {
  const armWidth = model === 'slim' ? 3 : 4;
  return [
    ...HEAD,
    ...TORSO,
    ...limb('right-arm', 40, 16, armWidth),
    ...limb('right-leg', 0, 16, 4),
    ...limb('left-leg', 16, 48, 4),
    ...limb('left-arm', 32, 48, armWidth),
  ];
}

export function getSkinRegions(
  format: SkinFormat,
  model: SkinModel,
  layer: 'base' | 'outer' = 'base'
): SkinRegion[] {
  const regions = javaRegions(model);
  const outerOrigins: Record<SkinPart, { x: number; y: number }> = {
    head: { x: 32, y: 0 },
    torso: { x: 16, y: 32 },
    'right-arm': { x: 40, y: 32 },
    'left-arm': { x: 48, y: 48 },
    'right-leg': { x: 0, y: 32 },
    'left-leg': { x: 0, y: 48 },
  };
  const baseOrigins: Record<SkinPart, { x: number; y: number }> = {
    head: { x: 0, y: 0 },
    torso: { x: 16, y: 16 },
    'right-arm': { x: 40, y: 16 },
    'left-arm': { x: 32, y: 48 },
    'right-leg': { x: 0, y: 16 },
    'left-leg': { x: 16, y: 48 },
  };
  const mapped =
    layer === 'outer'
      ? regions.map((region) => {
          const base = baseOrigins[region.part];
          const outer = outerOrigins[region.part];
          return {
            ...region,
            x: outer.x + (region.x - base.x),
            y: outer.y + (region.y - base.y),
          };
        })
      : regions;
  if (format === 'java-64') return mapped;
  return mapped.map((region) => ({
    ...region,
    x: region.x * 2,
    y: region.y * 2,
    width: region.width * 2,
    height: region.height * 2,
  }));
}
