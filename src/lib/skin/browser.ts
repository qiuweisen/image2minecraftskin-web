import type { ImageSource, SkinTexture } from './types';
import { textureOffset } from './types';

export function fileToImageSource(file: File): Promise<ImageSource> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas is unavailable'));
        return;
      }
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ width: data.width, height: data.height, pixels: data.data });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image could not be decoded'));
    };
    image.src = url;
  });
}

export function textureToDataUrl(texture: SkinTexture) {
  const canvas = document.createElement('canvas');
  canvas.width = texture.width;
  canvas.height = texture.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  const data = context.createImageData(texture.width, texture.height);
  data.data.set(texture.pixels);
  context.putImageData(data, 0, 0);
  return canvas.toDataURL('image/png');
}

export function drawTexture(
  canvas: HTMLCanvasElement,
  texture: SkinTexture,
  scale = 4
) {
  canvas.width = texture.width * scale;
  canvas.height = texture.height * scale;
  const context = canvas.getContext('2d');
  if (!context) return;
  context.imageSmoothingEnabled = false;
  const data = context.createImageData(texture.width, texture.height);
  data.data.set(texture.pixels);
  const source = document.createElement('canvas');
  source.width = texture.width;
  source.height = texture.height;
  source.getContext('2d')?.putImageData(data, 0, 0);
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'rgba(114,229,224,.25)';
  context.lineWidth = Math.max(1, scale / 4);
  for (let x = 0; x <= texture.width; x += 1) {
    context.beginPath();
    context.moveTo(x * scale, 0);
    context.lineTo(x * scale, canvas.height);
    context.stroke();
  }
  for (let y = 0; y <= texture.height; y += 1) {
    context.beginPath();
    context.moveTo(0, y * scale);
    context.lineTo(canvas.width, y * scale);
    context.stroke();
  }
}

export function averageColor(texture: SkinTexture) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  for (let y = 0; y < texture.height; y += 4) {
    for (let x = 0; x < texture.width; x += 4) {
      const offset = textureOffset(x, y, texture.width);
      r += texture.pixels[offset] ?? 0;
      g += texture.pixels[offset + 1] ?? 0;
      b += texture.pixels[offset + 2] ?? 0;
      count += 1;
    }
  }
  return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
}
