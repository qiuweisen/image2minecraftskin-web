import { describe, expect, it } from 'vitest';
import { inspectSkinImage } from '@/lib/skin/viewer';

describe('inspectSkinImage', () => {
  it('recognizes Java and Bedrock skin dimensions', () => {
    expect(inspectSkinImage('image/png', 64, 64)).toEqual({
      format: 'java-64',
      label: 'Java 64x64',
    });
    expect(inspectSkinImage('image/png', 128, 128)).toEqual({
      format: 'bedrock-128',
      label: 'Bedrock 128x128',
    });
  });

  it('rejects non-PNG files', () => {
    expect(() => inspectSkinImage('image/jpeg', 64, 64)).toThrow(
      'Choose a PNG skin file.'
    );
  });

  it('rejects unsupported texture dimensions', () => {
    expect(() => inspectSkinImage('image/png', 32, 32)).toThrow(
      'Skin textures must be 64x64 or 128x128 pixels.'
    );
  });
});
