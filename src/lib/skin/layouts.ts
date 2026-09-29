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
  model: SkinModel
): SkinRegion[] {
  const regions = javaRegions(model);
  if (format === 'java-64') return regions;
  return regions.map((region) => ({
    ...region,
    x: region.x * 2,
    y: region.y * 2,
    width: region.width * 2,
    height: region.height * 2,
  }));
}
