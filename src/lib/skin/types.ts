export type SkinFormat = 'java-64' | 'bedrock-128';
export type SkinModel = 'classic' | 'slim';

export type SkinTexture = {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  format: SkinFormat;
  model: SkinModel;
};

export type ImageSource = {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
};

export type CropSettings = {
  x: number;
  y: number;
  scale: number;
};

export const SKIN_DIMENSIONS: Record<SkinFormat, number> = {
  'java-64': 64,
  'bedrock-128': 128,
};

export function textureOffset(x: number, y: number, width: number) {
  return (y * width + x) * 4;
}
