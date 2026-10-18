import type { SkinTexture } from './types';

export function applyPixelStyle(texture: SkinTexture) {
  for (let i = 0; i < texture.pixels.length; i += 4) {
    const r = texture.pixels[i] ?? 0;
    const g = texture.pixels[i + 1] ?? 0;
    const b = texture.pixels[i + 2] ?? 0;
    const avg = (r + g + b) / 3;
    texture.pixels[i] = Math.max(
      0,
      Math.min(255, Math.round((avg + (r - avg) * 1.2 - 128) * 1.08 + 128))
    );
    texture.pixels[i + 1] = Math.max(
      0,
      Math.min(255, Math.round((avg + (g - avg) * 1.2 - 128) * 1.08 + 128))
    );
    texture.pixels[i + 2] = Math.max(
      0,
      Math.min(255, Math.round((avg + (b - avg) * 1.2 - 128) * 1.08 + 128))
    );
  }
}
