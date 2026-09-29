import type { SkinFormat, SkinTexture } from './types';
import { scaleSkinTexture } from './normalize';

export function exportSkinTexture(
  texture: SkinTexture,
  format: SkinFormat
): SkinTexture {
  return scaleSkinTexture(texture, format);
}

export function skinFilename(format: SkinFormat) {
  return format === 'java-64'
    ? 'image2minecraftskin-java-64x64.png'
    : 'image2minecraftskin-bedrock-128x128.png';
}
