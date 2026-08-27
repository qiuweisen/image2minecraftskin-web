import type { SkinFormat } from './types';

export type SkinImageInfo = {
  format: SkinFormat;
  label: string;
};

export function inspectSkinImage(
  mimeType: string,
  width: number,
  height: number
): SkinImageInfo {
  if (mimeType !== 'image/png') {
    throw new Error('Choose a PNG skin file.');
  }

  if (width === 64 && height === 64) {
    return { format: 'java-64', label: 'Java 64x64' };
  }

  if (width === 128 && height === 128) {
    return { format: 'bedrock-128', label: 'Bedrock 128x128' };
  }

  throw new Error('Skin textures must be 64x64 or 128x128 pixels.');
}
