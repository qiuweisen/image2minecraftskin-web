import type { SkinFormat } from './types';

export type SkinRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const SKIN_REGIONS: Record<SkinFormat, SkinRegion[]> = {
  'java-64': [
    { x: 8, y: 8, width: 8, height: 8 },
    { x: 20, y: 20, width: 8, height: 12 },
    { x: 44, y: 20, width: 4, height: 12 },
    { x: 36, y: 52, width: 4, height: 12 },
    { x: 4, y: 20, width: 4, height: 12 },
    { x: 20, y: 52, width: 4, height: 12 },
  ],
  'bedrock-128': [
    { x: 16, y: 16, width: 16, height: 16 },
    { x: 40, y: 40, width: 16, height: 24 },
    { x: 88, y: 40, width: 8, height: 24 },
    { x: 72, y: 104, width: 8, height: 24 },
    { x: 8, y: 40, width: 8, height: 24 },
    { x: 40, y: 104, width: 8, height: 24 },
  ],
};
