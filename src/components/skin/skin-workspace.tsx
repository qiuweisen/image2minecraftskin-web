import {
  IconAdjustmentsHorizontal,
  IconDownload,
  IconRefresh,
  IconUpload,
} from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSkinToolConfig } from '@/config/skin-tool-config';
import { trackSkinEvent } from '@/lib/analytics-events';
import {
  drawTexture,
  fileToImageSource,
  textureToDataUrl,
} from '@/lib/skin/browser';
import { exportSkinTexture, skinFilename } from '@/lib/skin/export';
import { mapImageToSkin, type PartCrops } from '@/lib/skin/normalize';
import {
  detectPartCrops,
  recommendAiSourceTransform,
} from '@/lib/skin/ai-improve';
import {
  applySourceTransform,
  IDENTITY_SOURCE_TRANSFORM,
  recommendSourceTransform,
  type SourceTransform,
} from '@/lib/skin/source-transform';
import type {
  ImageSource,
  SkinFormat,
  SkinModel,
  SkinTexture,
} from '@/lib/skin/types';
import { SkinPreview3d } from './skin-preview-3d';

const EXAMPLE_SOURCE_URL = '/examples/image-to-skin/portrait-source.webp';

async function loadExampleSource(): Promise<ImageSource | null> {
  try {
    const response = await fetch(EXAMPLE_SOURCE_URL);
    if (!response.ok) return null;
    const blob = await response.blob();
    const file = new File([blob], 'example.webp', { type: blob.type });
    return await fileToImageSource(file);
  } catch {
    return null;
  }
}

function fallbackExampleSource(): ImageSource {
  const width = 240;
  const height = 240;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context)
    return { width, height, pixels: new Uint8ClampedArray(width * height * 4) };
  context.fillStyle = '#0d252b';
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#2a1a20';
  context.fillRect(70, 18, 100, 34);
  context.fillStyle = '#d99a72';
  context.fillRect(70, 48, 100, 52);
  context.fillStyle = '#081013';
  context.fillRect(90, 66, 14, 12);
  context.fillRect(136, 66, 14, 12);
  context.fillStyle = '#72e5e0';
  context.fillRect(104, 84, 32, 8);

  context.fillStyle = '#d99a72';
  context.fillRect(26, 104, 34, 68);
  context.fillRect(180, 104, 34, 68);
  context.fillStyle = '#174a52';
  context.fillRect(60, 104, 120, 68);
  context.fillStyle = '#c7f36b';
  context.fillRect(72, 116, 96, 18);

  context.fillStyle = '#26363f';
  context.fillRect(70, 172, 46, 68);
  context.fillRect(124, 172, 46, 68);
  context.fillStyle = '#72e5e0';
  context.fillRect(70, 214, 46, 10);
  context.fillRect(124, 214, 46, 10);
  const image = context.getImageData(0, 0, width, height);
  return { width, height, pixels: image.data };
}

export function SkinWorkspace() {
  const config = getSkinToolConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<ImageSource>();
  const [sourcePreview, setSourcePreview] = useState<string>();
  const [format, setFormat] = useState<SkinFormat>(config.defaultFormat);
  const [model, setModel] = useState<SkinModel>(config.defaultModel);
  const [texture, setTexture] = useState<SkinTexture>();
  const [status, setStatus] = useState(config.copy.status.idle);
  const [error, setError] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [sourceTransform, setSourceTransform] = useState<SourceTransform>(
    IDENTITY_SOURCE_TRANSFORM
  );
  const [aiImproving, setAiImproving] = useState(false);
  // Latest format/model for async callbacks that outlive a render.
  const formatRef = useRef(format);
  const modelRef = useRef(model);
  formatRef.current = format;
  modelRef.current = model;
  // Analytics: where the current source came from, and per-source dedupe.
  const originRef = useRef<'example' | 'upload'>('example');
  const generationTrackedRef = useRef(false);
  const adjustedAxesRef = useRef(new Set<string>());
  // Bumped on new source or manual framing; stale pose results are dropped.
  const framingTokenRef = useRef(0);
  const startSource = (origin: 'example' | 'upload') => {
    framingTokenRef.current += 1;
    originRef.current = origin;
    generationTrackedRef.current = false;
    adjustedAxesRef.current.clear();
  };
  // Per-part crops from pose detection; cleared by any manual framing change.
  const [partCrops, setPartCrops] = useState<PartCrops>();
  // Full-pixel scan: memoize so slider drags don't rescan large photos.
  const recommendedTransform = useMemo(
    () =>
      source ? recommendSourceTransform(source) : IDENTITY_SOURCE_TRANSFORM,
    [source]
  );
  const hasAutomaticImprovement =
    recommendedTransform.x !== IDENTITY_SOURCE_TRANSFORM.x ||
    recommendedTransform.y !== IDENTITY_SOURCE_TRANSFORM.y ||
    recommendedTransform.zoom !== IDENTITY_SOURCE_TRANSFORM.zoom;

  const generate = useCallback(
    (
      nextSource: ImageSource,
      nextFormat = format,
      nextModel = model,
      crops?: PartCrops
    ) => {
      setStatus(config.copy.status.processing);
      setError(false);
      requestAnimationFrame(() => {
        try {
          const mapped = mapImageToSkin(
            nextSource,
            nextFormat,
            nextModel,
            crops
          );
          setTexture(mapped);
          setStatus(config.copy.status.complete);
          // Once per source: slider drags and format toggles re-run this and
          // previously inflated the count ~6x.
          if (!generationTrackedRef.current) {
            generationTrackedRef.current = true;
            trackSkinEvent({
              name: 'skin_generation_completed',
              payload: {
                origin: originRef.current,
                format: nextFormat,
                model: nextModel,
                sourceWidth: nextSource.width,
                sourceHeight: nextSource.height,
              },
            });
          }
        } catch {
          setStatus(config.copy.status.error);
          setError(true);
          trackSkinEvent({
            name: 'skin_generation_failed',
            payload: { reason: 'conversion_error' },
          });
        }
      });
    },
    [
      config.copy.status.complete,
      config.copy.status.error,
      config.copy.status.processing,
      format,
      model,
    ]
  );

  useEffect(() => {
    if (texture && canvasRef.current)
      drawTexture(canvasRef.current, texture, format === 'java-64' ? 5 : 3);
  }, [texture, format]);

  useEffect(() => {
    if (source) return;
    const loadInitialExample = async () => {
      startSource('example');
      const exampleSource = await loadExampleSource();
      const nextSource = exampleSource || fallbackExampleSource();
      setSource(nextSource);
      setPartCrops(undefined);
      setSourcePreview(exampleSource ? EXAMPLE_SOURCE_URL : undefined);
      generate(nextSource);
    };
    void loadInitialExample();
  }, [generate, source]);

  const loadSource = useCallback(
    async (file?: File) => {
      if (
        !file ||
        !config.acceptedTypes.includes(file.type) ||
        file.size > config.maxFileSizeBytes
      ) {
        setStatus(config.copy.status.invalid);
        setError(true);
        trackSkinEvent({
          name: 'skin_generation_failed',
          payload: { reason: 'invalid_file' },
        });
        return;
      }
      try {
        trackSkinEvent({
          name: 'skin_upload',
          payload: { mimeType: file.type, fileSize: file.size },
        });
        const nextSource = await fileToImageSource(file);
        startSource('upload');
        setSource(nextSource);
        setPartCrops(undefined);
        setSourcePreview(URL.createObjectURL(file));

        // Auto-apply recommended transform for better initial result
        const recommended = recommendSourceTransform(nextSource);
        const hasRecommendation =
          recommended.x !== IDENTITY_SOURCE_TRANSFORM.x ||
          recommended.y !== IDENTITY_SOURCE_TRANSFORM.y ||
          recommended.zoom !== IDENTITY_SOURCE_TRANSFORM.zoom;

        if (hasRecommendation) {
          setSourceTransform(recommended);
          setAdjustmentOpen(true);
          generate(applySourceTransform(nextSource, recommended));
          trackSkinEvent({
            name: 'skin_source_improved',
            payload: { ...recommended, trigger: 'auto_upload' },
          });
        } else {
          setSourceTransform(IDENTITY_SOURCE_TRANSFORM);
          setAdjustmentOpen(false);
          generate(nextSource);
        }

        // Background pose detection: upgrade to per-part crops if a person
        // is found and the user hasn't changed framing in the meantime.
        const token = framingTokenRef.current;
        void detectPartCrops(nextSource)
          .then((crops) => {
            if (!crops || token !== framingTokenRef.current) return;
            setPartCrops(crops);
            setSourceTransform(IDENTITY_SOURCE_TRANSFORM);
            generate(nextSource, formatRef.current, modelRef.current, crops);
            trackSkinEvent({
              name: 'skin_ai_improve_completed',
              payload: {
                mode: 'pose_parts_auto',
                ...IDENTITY_SOURCE_TRANSFORM,
              },
            });
          })
          .catch((error: unknown) => {
            trackSkinEvent({
              name: 'skin_ai_improve_failed',
              payload: {
                reason: `auto:${error instanceof Error ? error.message : 'unknown'}`,
              },
            });
          });
      } catch {
        setStatus(config.copy.status.error);
        setError(true);
        trackSkinEvent({
          name: 'skin_generation_failed',
          payload: { reason: 'decode_error' },
        });
      }
    },
    [
      config.acceptedTypes,
      config.copy.status.error,
      config.copy.status.invalid,
      config.maxFileSizeBytes,
      generate,
    ]
  );

  const loadExample = async () => {
    startSource('example');
    const exampleSource = await loadExampleSource();
    const nextSource = exampleSource || fallbackExampleSource();
    setSource(nextSource);
    setPartCrops(undefined);
    setSourcePreview(exampleSource ? EXAMPLE_SOURCE_URL : undefined);
    setSourceTransform(IDENTITY_SOURCE_TRANSFORM);
    setAdjustmentOpen(false);
    generate(nextSource);
  };

  // Re-run with current framing (pose crops win over the slider transform).
  const regenerate = (nextFormat: SkinFormat, nextModel: SkinModel) => {
    if (!source) return;
    if (partCrops) generate(source, nextFormat, nextModel, partCrops);
    else
      generate(
        applySourceTransform(source, sourceTransform),
        nextFormat,
        nextModel
      );
  };

  const adjustSource = (axis: keyof SourceTransform, value: number) => {
    if (!source) return;
    framingTokenRef.current += 1;
    setPartCrops(undefined);
    const nextTransform = { ...sourceTransform, [axis]: value };
    setSourceTransform(nextTransform);
    generate(applySourceTransform(source, nextTransform));
    // One event per axis per source; range inputs fire on every tick.
    if (!adjustedAxesRef.current.has(axis)) {
      adjustedAxesRef.current.add(axis);
      trackSkinEvent({
        name: 'skin_source_adjusted',
        payload: { axis, value, origin: originRef.current },
      });
    }
  };

  const resetFraming = () => {
    if (!source) return;
    framingTokenRef.current += 1;
    setPartCrops(undefined);
    setSourceTransform(IDENTITY_SOURCE_TRANSFORM);
    generate(source);
    trackSkinEvent({ name: 'skin_source_adjustment_reset', payload: {} });
  };

  const improveResult = () => {
    if (!source) return;
    framingTokenRef.current += 1;
    setPartCrops(undefined);
    const recommendation = recommendSourceTransform(source);
    setSourceTransform(recommendation);
    setAdjustmentOpen(true);
    generate(applySourceTransform(source, recommendation));
    trackSkinEvent({
      name: 'skin_source_improved',
      payload: { ...recommendation, trigger: 'button' },
    });
  };

  const improveWithAi = async () => {
    if (!source || aiImproving) return;
    framingTokenRef.current += 1;
    setAiImproving(true);
    trackSkinEvent({
      name: 'skin_ai_improve_clicked',
      payload: { format, model },
    });
    try {
      // Preferred: per-part crops from the detected pose, applied to the
      // untransformed source. Falls back to whole-subject framing.
      const crops = await detectPartCrops(source);
      if (crops) {
        setPartCrops(crops);
        setSourceTransform(IDENTITY_SOURCE_TRANSFORM);
        generate(source, format, model, crops);
        trackSkinEvent({
          name: 'skin_ai_improve_completed',
          payload: { mode: 'pose_parts', ...IDENTITY_SOURCE_TRANSFORM },
        });
        return;
      }
      const recommendation = await recommendAiSourceTransform(source);
      setPartCrops(undefined);
      setSourceTransform(recommendation);
      setAdjustmentOpen(true);
      generate(applySourceTransform(source, recommendation));
      trackSkinEvent({
        name: 'skin_ai_improve_completed',
        payload: { mode: 'framing', ...recommendation },
      });
    } catch (error) {
      trackSkinEvent({
        name: 'skin_ai_improve_failed',
        payload: {
          reason: error instanceof Error ? error.message : 'unknown',
        },
      });
    } finally {
      setAiImproving(false);
    }
  };

  const changeFormat = (nextFormat: SkinFormat) => {
    setFormat(nextFormat);
    trackSkinEvent({
      name: 'skin_format_selected',
      payload: { format: nextFormat },
    });
    if (source) regenerate(nextFormat, model);
  };

  const changeModel = (nextModel: SkinModel) => {
    setModel(nextModel);
    trackSkinEvent({
      name: 'skin_model_selected',
      payload: { model: nextModel },
    });
    if (source) regenerate(format, nextModel);
  };

  const download = () => {
    if (!texture) return;
    const exported = exportSkinTexture(texture, format);
    const url = textureToDataUrl(exported);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = skinFilename(format);
    anchor.click();
    trackSkinEvent({
      name: 'skin_downloaded',
      payload: {
        format,
        model,
        origin: originRef.current,
        framing: partCrops ? 'pose_parts' : 'transform',
      },
    });
  };

  const skinUrl = texture ? textureToDataUrl(texture) : undefined;

  return (
    <section
      id="generator"
      className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100 shadow-xl"
      aria-label={config.copy.workspaceLabel}
    >
      <header className="flex min-h-12 items-center justify-between gap-4 border-b border-zinc-800 px-4 font-mono text-xs uppercase tracking-[0.08em] text-cyan-300 sm:px-6">
        <span>{config.copy.previewTitle}</span>
        <span className={error ? 'text-red-300' : 'text-zinc-500'}>
          {status}
        </span>
      </header>
      <div className="grid lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
        <div className="border-b border-zinc-800 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <button
            type="button"
            className="grid min-h-44 w-full place-items-center border border-dashed border-cyan-300/70 bg-cyan-300/5 p-5 text-center transition-colors hover:bg-cyan-300/10"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void loadSource(event.dataTransfer.files[0]);
            }}
          >
            <span className="grid justify-items-center gap-2">
              <IconUpload className="size-7 text-cyan-300" />
              <strong>{config.copy.uploadTitle}</strong>
              <span className="text-xs text-zinc-400">
                {config.copy.uploadHint}
              </span>
            </span>
          </button>
          <div className="mt-3 rounded border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-relaxed text-zinc-400">
            <p className="mb-1 font-semibold text-cyan-300">Best results:</p>
            <ul className="space-y-0.5">
              <li>✓ Front-facing portrait or character</li>
              <li>✓ Transparent or solid background</li>
              <li>✓ Subject centered in frame</li>
              <li>✓ Square ratio (1:1) recommended</li>
            </ul>
          </div>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept={config.acceptedTypes.join(',')}
            onChange={(event) => void loadSource(event.target.files?.[0])}
          />
          <button
            type="button"
            className="mt-3 h-9 w-full border border-zinc-700 bg-transparent px-3 text-sm text-zinc-300 hover:border-cyan-300 hover:text-cyan-200"
            onClick={loadExample}
          >
            {config.copy.exampleLabel}
          </button>
          {sourcePreview && (
            <img
              className="mt-4 aspect-video w-full object-cover"
              src={sourcePreview}
              alt={config.copy.sourceAlt}
            />
          )}
          {source && (
            <div className="mt-4 border border-zinc-800 bg-zinc-900/60">
              <button
                type="button"
                aria-expanded={adjustmentOpen}
                className="flex min-h-11 w-full items-center justify-between gap-3 px-3 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                onClick={() => {
                  const nextOpen = !adjustmentOpen;
                  setAdjustmentOpen(nextOpen);
                  if (nextOpen) {
                    trackSkinEvent({
                      name: 'skin_source_adjustment_opened',
                      payload: { format, model },
                    });
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <IconAdjustmentsHorizontal className="size-4 text-cyan-300" />
                  {config.copy.adjustSource}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {adjustmentOpen ? 'Close' : 'Optional'}
                </span>
              </button>
              {adjustmentOpen && (
                <div className="grid gap-4 border-t border-zinc-800 p-3">
                  <button
                    type="button"
                    className="min-h-10 border border-lime-300/70 bg-lime-300/10 px-3 text-left text-sm text-lime-100 hover:bg-lime-300/20 disabled:cursor-wait disabled:opacity-60"
                    onClick={() => void improveWithAi()}
                    disabled={aiImproving}
                  >
                    {aiImproving
                      ? 'Analyzing image...'
                      : 'AI Improve (experimental)'}
                  </button>
                  {hasAutomaticImprovement && (
                    <button
                      type="button"
                      className="min-h-10 border border-cyan-300/70 bg-cyan-300/10 px-3 text-left text-sm text-cyan-100 hover:bg-cyan-300/20"
                      onClick={improveResult}
                    >
                      Improve transparent subject framing
                    </button>
                  )}
                  {(
                    [
                      ['zoom', config.copy.zoom, 1, 2.5, 0.1],
                      ['x', config.copy.horizontal, -1, 1, 0.1],
                      ['y', config.copy.vertical, -1, 1, 0.1],
                    ] as const
                  ).map(([axis, label, min, max, step]) => (
                    <label
                      key={axis}
                      className="grid gap-2 text-xs text-zinc-400"
                    >
                      <span className="flex justify-between gap-4">
                        {label}
                        <output className="font-mono text-zinc-300">
                          {sourceTransform[axis].toFixed(1)}
                        </output>
                      </span>
                      <input
                        aria-label={label}
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={sourceTransform[axis]}
                        onChange={(event) =>
                          adjustSource(axis, Number(event.currentTarget.value))
                        }
                        className="accent-cyan-300"
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    className="min-h-10 border border-zinc-700 px-3 text-sm text-zinc-300 hover:border-cyan-300"
                    onClick={resetFraming}
                  >
                    {config.copy.resetFraming}
                  </button>
                </div>
              )}
            </div>
          )}
          <fieldset className="mt-6 grid gap-2">
            <legend className="text-xs uppercase tracking-[0.08em] text-zinc-500">
              {config.copy.formatLabel}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {config.formats.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={format === option.value}
                  className={`min-h-10 border px-2 text-sm ${format === option.value ? 'border-cyan-300 bg-cyan-300 text-zinc-950' : 'border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-400'}`}
                  onClick={() => changeFormat(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-6 grid gap-2">
            <legend className="text-xs uppercase tracking-[0.08em] text-zinc-500">
              {config.copy.modelLabel}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {config.models.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={model === option.value}
                  className={`min-h-10 border px-2 text-sm ${model === option.value ? 'border-cyan-300 bg-cyan-300 text-zinc-950' : 'border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-400'}`}
                  onClick={() => changeModel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="mt-6 text-xs leading-5 text-zinc-500">
            {config.copy.localNote}
          </p>
          <div className="mt-6 flex gap-2">
            <Button
              type="button"
              className="flex-1"
              size="lg"
              disabled={!texture}
              onClick={download}
            >
              <IconDownload /> {config.copy.download}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              onClick={() => {
                trackSkinEvent({
                  name: 'skin_retry_started',
                  payload: { location: 'generator_workspace' },
                });
                setSource(undefined);
                setSourcePreview(undefined);
                setTexture(undefined);
                setStatus(config.copy.status.idle);
              }}
              aria-label={config.copy.reset}
            >
              <IconRefresh />
            </Button>
          </div>
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <SkinPreview3d
              skinUrl={skinUrl}
              label={config.copy.preview3dLabel}
            />
            <div className="relative grid min-h-80 place-items-center overflow-auto border border-zinc-800 bg-zinc-900 p-4">
              <canvas
                ref={canvasRef}
                className="max-w-full"
                aria-label={config.copy.textureLabel}
              />
              {!texture && (
                <p className="absolute text-sm text-zinc-500">
                  {config.copy.previewEmpty}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-zinc-500">
            <span>
              {config.formats.find((option) => option.value === format)?.label}
            </span>
            <span>
              {config.models.find((option) => option.value === model)?.label}
            </span>
          </div>
          {texture && (
            <>
              <p className="mt-4 border-l-2 border-green-400 bg-green-400/5 pl-3 py-2 text-sm leading-6 text-zinc-300">
                <strong className="text-green-400">✓ Ready to download!</strong>{' '}
                Rotate the 3D model to inspect all sides, then download below.
              </p>
              <Button
                type="button"
                className="mt-4 w-full"
                size="lg"
                disabled={!texture}
                onClick={download}
              >
                <IconDownload /> {config.copy.download}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
