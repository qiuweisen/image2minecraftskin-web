import {
  SKIN_DIMENSIONS,
  type ImageSource,
  type SkinFormat,
  type SkinModel,
  type SkinTexture,
  type GenerationOptions,
  type SkinStyle,
  type SubjectKind,
  textureOffset,
} from './types';
import { getSkinRegions, type SkinPart, type SkinRegion } from './layouts';
import {
  dominantColor,
  subjectDominantColor,
  paintTemplate,
  isNearBlack,
  ensureNonBlack,
} from './templates';
import { applyPixelStyle } from './style';

/** Normalized (0-1) crop rectangle inside the source image. */
export type PartBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Optional per-part crops, e.g. from pose detection. */
export type PartCrops = Partial<Record<SkinPart, PartBounds>>;

// Max samples per axis for one target pixel. Bounds cost on large photos.
const MAX_SAMPLES_PER_AXIS = 6;
const ALPHA_CUTOFF = 16;
type MaskedImageSource = ImageSource & {
  mask?: Uint8Array;
  hairMask?: Uint8Array;
};

const DEFAULT_CROPS: Record<SkinPart, PartBounds> = {
  head: { x: 0.2, y: 0, width: 0.6, height: 0.34 },
  torso: { x: 0.24, y: 0.33, width: 0.52, height: 0.38 },
  'right-arm': { x: 0, y: 0.33, width: 0.28, height: 0.38 },
  'left-arm': { x: 0.72, y: 0.33, width: 0.28, height: 0.38 },
  'right-leg': { x: 0.24, y: 0.66, width: 0.28, height: 0.34 },
  'left-leg': { x: 0.48, y: 0.66, width: 0.28, height: 0.34 },
};

export function createBlankSkin(
  format: SkinFormat,
  model: SkinModel = 'classic'
): SkinTexture {
  const size = SKIN_DIMENSIONS[format];
  return {
    width: size,
    height: size,
    pixels: new Uint8ClampedArray(size * size * 4),
    format,
    model,
  };
}

/**
 * Averages the source rectangle [x0,x1) x [y0,y1) with a bounded stratified
 * grid. Colour is alpha-weighted so transparent background pixels do not
 * bleed dark/white fringes into the subject. Output is straight (non
 * premultiplied) RGBA, matching PNG.
 */
function sampleArea(
  source: MaskedImageSource,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): [number, number, number, number] {
  const spanX = Math.max(1e-6, x1 - x0);
  const spanY = Math.max(1e-6, y1 - y0);
  const stepsX = Math.min(MAX_SAMPLES_PER_AXIS, Math.max(1, Math.ceil(spanX)));
  const stepsY = Math.min(MAX_SAMPLES_PER_AXIS, Math.max(1, Math.ceil(spanY)));
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (let j = 0; j < stepsY; j += 1) {
    const sy = Math.min(
      source.height - 1,
      Math.max(0, Math.floor(y0 + ((j + 0.5) / stepsY) * spanY))
    );
    for (let i = 0; i < stepsX; i += 1) {
      const sx = Math.min(
        source.width - 1,
        Math.max(0, Math.floor(x0 + ((i + 0.5) / stepsX) * spanX))
      );
      const offset = textureOffset(sx, sy, source.width);
      const mask = source.mask?.[sy * source.width + sx];
      const alpha =
        (source.pixels[offset + 3] ?? 255) *
        (mask === undefined ? 1 : mask > 0 ? 1 : 0);
      r += (source.pixels[offset] ?? 0) * alpha;
      g += (source.pixels[offset + 1] ?? 0) * alpha;
      b += (source.pixels[offset + 2] ?? 0) * alpha;
      a += alpha;
    }
  }
  const count = stepsX * stepsY;
  const meanAlpha = a / count;
  if (meanAlpha < ALPHA_CUTOFF || a === 0) return [0, 0, 0, 0];
  return [
    Math.round(r / a),
    Math.round(g / a),
    Math.round(b / a),
    Math.round(meanAlpha),
  ];
}

type Rect = { x: number; y: number; width: number; height: number };

// Every part is laid out as six faces in this order (see layouts.ts).
type Face = 'top' | 'bottom' | 'right' | 'front' | 'left' | 'back';
const FACE_ORDER: Face[] = ['top', 'bottom', 'right', 'front', 'left', 'back'];

// Fraction of the front crop used for faces a single photo can't see.
const EDGE_STRIP = 0.2;

/**
 * A photo only shows the front. Instead of repeating the front crop on
 * every face (which put the face on the back and top of the head), each
 * hidden face samples the adjacent edge of the front crop: the top strip for
 * the top (hair on the head), the outer columns for the sides, and so on.
 */
function faceCrop(
  crop: Rect,
  face: Face,
  part: SkinPart
): { rect: Rect; mirror: boolean } {
  const stripW = crop.width * EDGE_STRIP;
  const stripH = crop.height * EDGE_STRIP;
  switch (face) {
    case 'front':
      return { rect: crop, mirror: false };
    case 'top':
      // Prefer the hairline band inside the head crop, not the absolute top
      // which is often sky/background above a selfie.
      if (part === 'head') {
        return {
          rect: {
            ...crop,
            y: crop.y + crop.height * 0.08,
            height: Math.max(1, crop.height * 0.22),
          },
          mirror: false,
        };
      }
      return { rect: { ...crop, height: stripH }, mirror: false };
    case 'bottom':
      return {
        rect: { ...crop, y: crop.y + crop.height - stripH, height: stripH },
        mirror: false,
      };
    case 'right':
      // Subject's right side is on the image's left edge.
      return { rect: { ...crop, width: stripW }, mirror: false };
    case 'left':
      return {
        rect: { ...crop, x: crop.x + crop.width - stripW, width: stripW },
        mirror: false,
      };
    case 'back':
      // Head: hair from the upper face band, not sky above the crown.
      // Body and limbs: mirror the front so clothing wraps continuously.
      return part === 'head'
        ? {
            rect: {
              ...crop,
              y: crop.y + crop.height * 0.05,
              height: Math.max(1, crop.height * 0.28),
            },
            mirror: false,
          }
        : { rect: crop, mirror: true };
  }
}

function paintRegion(
  texture: SkinTexture,
  source: ImageSource,
  region: SkinRegion,
  crop: Rect,
  mirror = false
) {
  const cellWidth = crop.width / region.width;
  const cellHeight = crop.height / region.height;
  for (let y = 0; y < region.height; y += 1) {
    for (let x = 0; x < region.width; x += 1) {
      const sx = mirror ? region.width - 1 - x : x;
      const color = sampleArea(
        source,
        crop.x + sx * cellWidth,
        crop.y + y * cellHeight,
        crop.x + (sx + 1) * cellWidth,
        crop.y + (y + 1) * cellHeight
      );
      const offset = textureOffset(region.x + x, region.y + y, texture.width);
      texture.pixels.set(color, offset);
    }
  }
}

function sourceCrop(
  source: ImageSource,
  part: SkinPart,
  crops?: PartCrops,
  face?: GenerationOptions['face']
) {
  if (part === 'head' && face)
    return {
      x: source.width * Math.max(0, face.x - face.width * 0.35),
      y: source.height * Math.max(0, face.y - face.height * 0.45),
      width: Math.max(1, source.width * face.width * 1.7),
      height: Math.max(1, source.height * face.height * 2.1),
    };
  const crop = crops?.[part] ?? DEFAULT_CROPS[part];
  return {
    x: source.width * crop.x,
    y: source.height * crop.y,
    width: Math.max(1, source.width * crop.width),
    height: Math.max(1, source.height * crop.height),
  };
}

export function mapImageToSkin(
  source: ImageSource,
  format: SkinFormat,
  model: SkinModel = 'classic',
  cropsOrOptions?: PartCrops | GenerationOptions
): SkinTexture {
  if (source.width < 1 || source.height < 1) {
    throw new Error('Image source must have positive dimensions');
  }
  const texture = createBlankSkin(format, model);
  const options: GenerationOptions =
    cropsOrOptions &&
    ('kind' in cropsOrOptions ||
      'style' in cropsOrOptions ||
      'faceDetails' in cropsOrOptions ||
      'mask' in cropsOrOptions ||
      'crops' in cropsOrOptions)
      ? (cropsOrOptions as GenerationOptions)
      : { crops: cropsOrOptions as PartCrops | undefined };
  const kind: SubjectKind = options.kind ?? 'auto';
  const resolvedKind =
    kind === 'auto'
      ? source.height < source.width * 1.12
        ? 'portrait'
        : 'full-body'
      : kind;
  // Transparent cutouts (anime/logo/sprites): keep prod-like unmasked sampling.
  let transparent = 0;
  for (let i = 3; i < source.pixels.length; i += 16) {
    if ((source.pixels[i] ?? 255) < 16) transparent += 1;
  }
  const isCutoutArt = transparent > (source.pixels.length / 4) * 0.05;
  // Gate: selfie/face masks on real photos only — never on cutout art.
  const useMask =
    Boolean(options.mask) &&
    !isCutoutArt &&
    resolvedKind !== 'logo' &&
    (Boolean(options.face) ||
      (options.maskSource === 'selfie' && resolvedKind === 'portrait'));
  const maskedSource = useMask
    ? ({ ...source, mask: options.mask } as MaskedImageSource)
    : source;
  const partCrops = (options.crops ?? cropsOrOptions) as PartCrops | undefined;
  const regions = getSkinRegions(format, model);
  regions.forEach((region, index) => {
    const face = FACE_ORDER[index % FACE_ORDER.length];
    const { rect, mirror } = faceCrop(
      sourceCrop(maskedSource, region.part, partCrops, options.face),
      face,
      region.part
    );
    paintRegion(texture, maskedSource, region, rect, mirror);
  });
  // Subject tones for hole-fill / occluded faces — trust the mask so clothing
  // blues/greens are kept. Never emit flat 0x888 gray.
  const skinTone = subjectDominantColor(maskedSource, {
    x: 0.34,
    y: 0.18,
    width: 0.32,
    height: 0.22,
  });
  const shirtTone = subjectDominantColor(maskedSource, {
    x: 0.28,
    y: 0.38,
    width: 0.44,
    height: 0.32,
  });
  const pantsTone = subjectDominantColor(maskedSource, {
    x: 0.3,
    y: 0.66,
    width: 0.4,
    height: 0.26,
  });
  const hairTone = options.hairMask
    ? dominantColor(
        { ...source, mask: options.hairMask },
        { x: 0.2, y: 0.05, width: 0.6, height: 0.3 }
      )
    : dominantColor(maskedSource, {
        x: 0.28,
        y: 0.05,
        width: 0.44,
        height: 0.2,
      });

  const safeSkin = ensureNonBlack(skinTone);
  const safeShirt = ensureNonBlack(shirtTone, safeSkin);
  const safePants = ensureNonBlack(pantsTone, safeShirt);
  const safeHair = ensureNonBlack(hairTone, safeSkin);

  // Fill transparent OR near-black voids in every base region (never leave
  // pure-black holes). Intentional face-detail eyes are painted later.
  for (let regionIndex = 0; regionIndex < regions.length; regionIndex += 1) {
    const region = regions[regionIndex]!;
    const face = FACE_ORDER[regionIndex % FACE_ORDER.length]!;
    let fallback: readonly number[];
    if (region.part === 'head' && (face === 'top' || face === 'back')) {
      fallback = safeHair;
    } else if (region.part === 'head') {
      fallback = safeSkin;
    } else if (region.part === 'torso') {
      fallback = safeShirt;
    } else if (region.part.endsWith('arm')) {
      fallback = safeShirt;
    } else {
      fallback = safePants;
    }
    for (let y = region.y; y < region.y + region.height; y++)
      for (let x = region.x; x < region.x + region.width; x++) {
        const i = textureOffset(x, y, texture.width);
        const color = [
          texture.pixels[i] ?? 0,
          texture.pixels[i + 1] ?? 0,
          texture.pixels[i + 2] ?? 0,
          texture.pixels[i + 3] ?? 0,
        ] as const;
        if (isNearBlack(color)) texture.pixels.set(fallback, i);
      }
  }

  // Lite / prod-like: faceless non-selfie-portrait (statues, missed detections)
  // and cutouts. Skip hair/back post-process so we stay close to prod sampling.
  const litePath =
    isCutoutArt ||
    (!options.face &&
      !(
        options.maskSource === 'selfie' &&
        resolvedKind === 'portrait' &&
        useMask
      ));

  // Structural templates only for animal/logo cutouts.
  if (resolvedKind === 'animal' || resolvedKind === 'logo') {
    paintTemplate(texture, maskedSource, resolvedKind);
  }

  if (!litePath) {
    // Occluded head top/back: prefer hair, else copy from the head-front band
    // (not flat gray).
    {
      const headFront = regions.find(
        (region, index) =>
          region.part === 'head' &&
          FACE_ORDER[index % FACE_ORDER.length] === 'front'
      );
      let hair = hairTone;
      if (headFront) {
        // Average top two rows of the front face as a hairline proxy.
        let r = 0,
          g = 0,
          b = 0,
          n = 0;
        for (
          let y = headFront.y;
          y < headFront.y + Math.min(2, headFront.height);
          y++
        )
          for (let x = headFront.x; x < headFront.x + headFront.width; x++) {
            const i = textureOffset(x, y, texture.width);
            r += texture.pixels[i] ?? 0;
            g += texture.pixels[i + 1] ?? 0;
            b += texture.pixels[i + 2] ?? 0;
            n += 1;
          }
        if (n > 0) {
          const fromFront = [
            Math.round(r / n),
            Math.round(g / n),
            Math.round(b / n),
            255,
          ] as const;
          // If hairTone looks like the empty-bin warm default AND front has signal, use front.
          const hairIsWeak =
            Math.abs(hair[0] - 120) +
              Math.abs(hair[1] - 100) +
              Math.abs(hair[2] - 85) <
            40;
          if (hairIsWeak) hair = fromFront;
        }
      }
      regions.forEach((region, index) => {
        if (region.part !== 'head') return;
        const face = FACE_ORDER[index % FACE_ORDER.length];
        if (face !== 'top' && face !== 'back') return;
        for (let y = region.y; y < region.y + region.height; y += 1)
          for (let x = region.x; x < region.x + region.width; x += 1)
            texture.pixels.set(hair, textureOffset(x, y, texture.width));
      });
    }

    // Back faces of body/limbs: mirror the front face of the same part so we
    // never leave occluded sides as empty gray when the front has subject color.
    {
      const byPart = new Map<
        string,
        { front?: (typeof regions)[number]; back?: (typeof regions)[number] }
      >();
      regions.forEach((region, index) => {
        const face = FACE_ORDER[index % FACE_ORDER.length];
        if (face !== 'front' && face !== 'back') return;
        if (region.part === 'head') return; // head back already handled via hair
        const entry = byPart.get(region.part) ?? {};
        if (face === 'front') entry.front = region;
        else entry.back = region;
        byPart.set(region.part, entry);
      });
      for (const { front, back } of byPart.values()) {
        if (!front || !back) continue;
        const h = Math.min(front.height, back.height);
        const w = Math.min(front.width, back.width);
        for (let y = 0; y < h; y += 1)
          for (let x = 0; x < w; x += 1) {
            const src = textureOffset(front.x + x, front.y + y, texture.width);
            const dst = textureOffset(
              back.x + (w - 1 - x),
              back.y + y,
              texture.width
            );
            texture.pixels.set(texture.pixels.subarray(src, src + 4), dst);
          }
      }
    }
  }

  if (
    options.faceDetails &&
    resolvedKind !== 'animal' &&
    resolvedKind !== 'logo'
  ) {
    const s = texture.width / 64;
    const pixel = (x: number, y: number, color: number[]) =>
      texture.pixels.set(color, textureOffset(x * s, y * s, texture.width));
    for (const x of [10, 13]) {
      pixel(x, 12, [31, 42, 49, 255]);
      pixel(x, 13, [31, 42, 49, 255]);
    }
    pixel(11, 15, [113, 63, 57, 255]);
    pixel(12, 15, [113, 63, 57, 255]);
  }
  // Final base-layer integrity: no transparent / near-black voids.
  // Intentional face-detail eyes use [31,42,49] (sum>30) so they survive.
  {
    const fallback = ensureNonBlack(safeShirt, safeSkin);
    for (const region of regions) {
      for (let y = region.y; y < region.y + region.height; y++)
        for (let x = region.x; x < region.x + region.width; x++) {
          const i = textureOffset(x, y, texture.width);
          const color = [
            texture.pixels[i] ?? 0,
            texture.pixels[i + 1] ?? 0,
            texture.pixels[i + 2] ?? 0,
            texture.pixels[i + 3] ?? 0,
          ] as const;
          if (isNearBlack(color)) texture.pixels.set(fallback, i);
        }
    }
  }

  const style: SkinStyle = options.style ?? 'photo';
  if (style === 'pixel') applyPixelStyle(texture);
  return texture;
}

/**
 * Resizes a finished skin between Java and Bedrock sizes. Nearest-neighbour
 * on purpose: skins are pixel art, and filtering would blur face seams and
 * bleed into transparent overlay areas.
 */
export function scaleSkinTexture(
  texture: SkinTexture,
  format: SkinFormat,
  model = texture.model
): SkinTexture {
  const targetSize = SKIN_DIMENSIONS[format];
  if (texture.width === targetSize && texture.height === targetSize) {
    return { ...texture, format, model };
  }
  const pixels = new Uint8ClampedArray(targetSize * targetSize * 4);
  for (let y = 0; y < targetSize; y += 1) {
    for (let x = 0; x < targetSize; x += 1) {
      const sx = Math.floor((x / targetSize) * texture.width);
      const sy = Math.floor((y / targetSize) * texture.height);
      const sourceOffset = textureOffset(sx, sy, texture.width);
      pixels.set(
        texture.pixels.subarray(sourceOffset, sourceOffset + 4),
        textureOffset(x, y, targetSize)
      );
    }
  }
  return { width: targetSize, height: targetSize, pixels, format, model };
}
