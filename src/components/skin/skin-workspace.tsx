import {
  IconAdjustmentsHorizontal,
  IconDownload,
  IconRefresh,
  IconUpload,
} from '@tabler/icons-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { aiHdFromPriceUsd, getSkinToolConfig } from '@/config/skin-tool-config';
import { joinAiWaitlist } from '@/api/ai-waitlist';
import { startSkinTask, uploadSkinInput } from '@/api/credit-tasks';
import { clientEnv } from '@/env/client';
import { authClient } from '@/auth/client';
import { SkinTaskCard } from './skin-task-card';
import { m } from '@/locale/paraglide/messages';
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
import type { SubjectKind, SkinStyle } from '@/lib/skin/types';
import { SkinPreview3d } from './skin-preview-3d';
import { analyzeSource, type VisionAnalysis } from '@/lib/skin/vision';

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
  const [sourceName, setSourceName] = useState<string>();
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
  const [subjectKind, setSubjectKind] = useState<SubjectKind>('auto');
  const [skinStyle, setSkinStyle] = useState<SkinStyle>('photo');
  const [faceDetails, setFaceDetails] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiFile, setAiFile] = useState<File>();
  const [aiConsent, setAiConsent] = useState(false);
  const [aiModel, setAiModel] = useState<SkinModel>('classic');
  const [aiSubject, setAiSubject] = useState<'person' | 'pet'>('person');
  const [aiTask, setAiTask] =
    useState<Awaited<ReturnType<typeof startSkinTask>>>();
  const [aiError, setAiError] = useState<string>();
  const { data: session } = authClient.useSession();
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [importGuideOpen, setImportGuideOpen] = useState(false);
  const [visionProgress, setVisionProgress] = useState<number>();
  const analysisRef = useRef<VisionAnalysis | undefined>(undefined);
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
    async (
      nextSource: ImageSource,
      nextFormat = format,
      nextModel = model,
      crops?: PartCrops
    ) => {
      setStatus(m.skin_models_loading({ percent: visionProgress ?? 0 }));
      setError(false);
      const started = performance.now();
      let analysis: VisionAnalysis | undefined = analysisRef.current;
      if (!analysis) {
        try {
          analysis = await Promise.race([
            analyzeSource(nextSource, (percent) => {
              setVisionProgress(percent);
              setStatus(m.skin_models_loading({ percent }));
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('vision_timeout')), 15000)
            ),
          ]);
          analysisRef.current = analysis;
          setVisionProgress(undefined);
          trackSkinEvent({
            name: 'skin_models_load',
            payload: { duration_ms: analysis.loadMs },
          });
        } catch (visionError) {
          setVisionProgress(undefined);
          trackSkinEvent({
            name: 'skin_models_failed',
            payload: {
              reason:
                visionError instanceof Error ? visionError.message : 'unknown',
            },
          });
          analysis = undefined;
        }
      }
      requestAnimationFrame(() => {
        try {
          const resolvedKind =
            subjectKind === 'auto' ? analysis?.kind : subjectKind;
          const mapped = mapImageToSkin(nextSource, nextFormat, nextModel, {
            crops: crops ?? analysis?.poseCrops,
            kind: resolvedKind ?? subjectKind,
            style: skinStyle,
            faceDetails,
            mask: analysis?.mask,
            hairMask: analysis?.hairMask,
            maskSource: analysis?.maskSource,
            face: analysis?.face,
          });
          setTexture(mapped);
          setStatus(config.copy.status.complete);
          trackSkinEvent({
            name: 'skin_generate_done',
            payload: {
              subject_kind: resolvedKind ?? subjectKind,
              variant: skinStyle,
              format: nextFormat,
              model: nextModel,
              face_found: Boolean(analysis?.faceFound),
              duration_ms: Math.round(performance.now() - started),
            },
          });
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
          trackSkinEvent({
            name: 'skin_generate_done',
            payload: {
              subject_kind: subjectKind,
              variant: skinStyle,
              format: nextFormat,
              model: nextModel,
              face_found: false,
              duration_ms: 0,
            },
          });
        }
      });
    },
    [
      config.copy.status.complete,
      config.copy.status.error,
      config.copy.status.processing,
      subjectKind,
      skinStyle,
      faceDetails,
    ]
  );

  useEffect(() => {
    if (texture && canvasRef.current)
      drawTexture(canvasRef.current, texture, format === 'java-64' ? 5 : 3);
  }, [texture, format]);

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
        analysisRef.current = undefined;
        setPartCrops(undefined);
        setSourceName(file.name);
        setSourcePreview(URL.createObjectURL(file));

        // Auto-apply recommended transform for better initial result
        const recommended = recommendSourceTransform(nextSource);
        const hasRecommendation =
          recommended.x !== IDENTITY_SOURCE_TRANSFORM.x ||
          recommended.y !== IDENTITY_SOURCE_TRANSFORM.y ||
          recommended.zoom !== IDENTITY_SOURCE_TRANSFORM.zoom;

        if (hasRecommendation) {
          setSourceTransform(recommended);
          setAdjustmentOpen(false);
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
    analysisRef.current = undefined;
    setPartCrops(undefined);
    setSourceName('example.webp');
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
    trackSkinEvent({ name: 'skin_download', payload: { format, model } });
    setImportGuideOpen(true);
  };

  const submitWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await joinAiWaitlist({ data: { email: waitlistEmail, honeypot } });
    trackSkinEvent({ name: 'ai_waitlist_submit', payload: {} });
    setWaitlistDone(true);
  };

  const submitAi = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAiError(undefined);
    if (!session?.user) {
      setAiError('请先登录后使用 AI 版本。');
      return;
    }
    if (
      !aiFile ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(aiFile.type) ||
      aiFile.size > 10 * 1024 * 1024
    ) {
      setAiError('请选择 JPG、PNG 或 WebP 图片（最大 10MB）。');
      return;
    }
    if (!aiConsent) {
      setAiError('请先同意照片会发送给第三方 AI。');
      return;
    }
    try {
      trackSkinEvent({
        name: 'ai_generate_start',
        payload: { preset: aiModel, subject_kind: aiSubject, model: aiModel },
      });
      const form = new FormData();
      form.append('file', aiFile);
      const uploaded = await uploadSkinInput({ data: form });
      const task = await startSkinTask({
        data: {
          bizKey: `skin-${crypto.randomUUID()}`,
          inputKey: uploaded.key,
          preset: `${aiModel}-${aiSubject}`,
        },
      });
      setAiTask(task);
      setAiPanelOpen(false);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : 'AI generation could not start.'
      );
      trackSkinEvent({
        name: 'ai_generate_fail',
        payload: { reason: 'start_failed' },
      });
    }
  };

  const skinUrl = texture ? textureToDataUrl(texture) : undefined;

  return (
    <section
      id="generator"
      className="skin-workspace-v51 overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100 shadow-xl"
      aria-label={config.copy.workspaceLabel}
    >
      <header className="flex min-h-12 items-center justify-between gap-4 border-b border-zinc-800 px-4 font-mono text-xs uppercase tracking-[0.08em] text-cyan-300 sm:px-6">
        <span>{config.copy.previewTitle}</span>
        <span className={error ? 'text-red-300' : 'text-zinc-500'}>
          {status}
        </span>
      </header>
      <div className="grid items-stretch lg:grid-cols-[minmax(280px,0.62fr)_minmax(0,1.38fr)]">
        <div className="skin-controls-v51 border-b border-zinc-800 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {!source ? (
            <button
              type="button"
              className="skin-drop-v51 grid min-h-44 w-full place-items-center border border-dashed border-cyan-300/70 bg-cyan-300/5 p-5 text-center transition-colors hover:bg-cyan-300/10"
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
          ) : (
            <>
              <div className="skin-source-v51 flex items-center gap-3 p-2">
                {sourcePreview ? (
                  <img src={sourcePreview} alt={config.copy.sourceAlt} />
                ) : (
                  <span
                    className="skin-source-placeholder-v51"
                    aria-hidden="true"
                  >
                    IMG
                  </span>
                )}
                <span className="grid min-w-0 gap-1">
                  <strong className="truncate text-sm text-zinc-100">
                    {sourceName ?? config.copy.sourceAlt}
                  </strong>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                    On this device
                  </span>
                </span>
              </div>
              <button
                type="button"
                className="skin-source-change-v51 mt-3 text-left text-xs text-cyan-200 hover:text-cyan-100"
                onClick={() => inputRef.current?.click()}
              >
                Choose another image
              </button>
            </>
          )}
          <input
            ref={inputRef}
            hidden
            type="file"
            accept={config.acceptedTypes.join(',')}
            onChange={(event) => void loadSource(event.target.files?.[0])}
          />
          <fieldset className="mt-5 grid gap-2">
            <legend className="text-xs uppercase tracking-[0.08em] text-zinc-500">
              {config.copy.modelLabel}
            </legend>
            <div className="skin-seg-v51 grid grid-cols-2 gap-2">
              {config.models.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={model === option.value}
                  className={`min-h-10 border px-2 text-sm ${model === option.value ? 'is-active border-cyan-300 bg-cyan-300 text-zinc-950' : 'border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-400'}`}
                  onClick={() => changeModel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          {!source ? (
            <>
              <div className="tips-v51 mt-4 rounded border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs leading-relaxed text-zinc-400">
                <p className="mb-1 font-semibold text-cyan-300">
                  {m.skin_best_results()}
                </p>
                <ul className="space-y-0.5">
                  <li>✓ {m.skin_best_front_facing()}</li>
                  <li>✓ {m.skin_best_background()}</li>
                  <li>✓ {m.skin_best_centered()}</li>
                  <li>✓ {m.skin_best_square()}</li>
                </ul>
              </div>
              <button
                type="button"
                className="skin-example-v51 mt-3 text-left"
                onClick={loadExample}
              >
                {config.copy.exampleLabel} →
              </button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="skin-download-v51 mt-5 w-full"
                size="lg"
                disabled={!texture}
                onClick={download}
              >
                <IconDownload />{' '}
                {format === 'java-64'
                  ? m.skin_download_java()
                  : m.skin_download_bedrock()}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="skin-ai-v51 mt-3 w-full border-cyan-300/70 text-cyan-100"
                onClick={() => {
                  if (clientEnv.VITE_AI_SKIN_ENABLED === 'true') {
                    trackSkinEvent({
                      name: 'ai_cta_click',
                      payload: { location: 'workspace' },
                    });
                    setAiPanelOpen(true);
                  } else {
                    trackSkinEvent({ name: 'ai_door_click', payload: {} });
                    setWaitlistOpen(true);
                  }
                }}
              >
                Make it more like you · 1 credit
              </Button>
            </>
          )}
          <details
            className="more-options-v51 mt-4"
            open={adjustmentOpen}
            onToggle={(event) => {
              const nextOpen = event.currentTarget.open;
              setAdjustmentOpen(nextOpen);
              if (nextOpen) {
                trackSkinEvent({
                  name: 'skin_source_adjustment_opened',
                  payload: { format, model },
                });
              }
            }}
          >
            <summary aria-label={`More options · ${config.copy.adjustSource}`}>
              <span className="flex items-center gap-2">
                <IconAdjustmentsHorizontal className="size-4 text-cyan-300" />
                More options
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                {adjustmentOpen ? 'Close' : 'Optional'}
              </span>
            </summary>
            <div className="more-options-body-v51 grid gap-4">
              <fieldset className="grid gap-2">
                <legend className="text-xs uppercase tracking-[0.08em] text-zinc-500">
                  {config.copy.formatLabel}
                </legend>
                <div className="skin-seg-v51 grid grid-cols-2 gap-2">
                  {config.formats.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={format === option.value}
                      className={`min-h-10 border px-2 text-sm ${format === option.value ? 'is-active border-cyan-300 bg-cyan-300 text-zinc-950' : 'border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-400'}`}
                      onClick={() => changeFormat(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-2 text-xs uppercase tracking-wider text-zinc-500">
                {config.copy.subjectKind}
                <select
                  value={subjectKind}
                  onChange={(event) => {
                    setSubjectKind(event.target.value as SubjectKind);
                    if (source) generate(source, format, model, partCrops);
                  }}
                  className="min-h-11 border border-zinc-700 bg-zinc-900 px-3 text-sm normal-case text-zinc-100"
                >
                  {config.copy.subjectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-xs uppercase tracking-wider text-zinc-500">
                Style
                <select
                  value={skinStyle}
                  onChange={(event) => {
                    setSkinStyle(event.target.value as SkinStyle);
                    if (source) generate(source, format, model, partCrops);
                  }}
                  className="min-h-11 border border-zinc-700 bg-zinc-900 px-3 text-sm normal-case text-zinc-100"
                >
                  <option value="photo">{m.skin_style_photo()}</option>
                  <option value="pixel">{m.skin_style_pixel()}</option>
                </select>
              </label>
              <label className="flex min-h-11 items-center gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={faceDetails}
                  onChange={(event) => {
                    setFaceDetails(event.target.checked);
                    if (source) generate(source, format, model, partCrops);
                  }}
                />{' '}
                {m.skin_face_details()}
              </label>
              {source && (
                <div className="grid gap-4 border-t border-zinc-800 pt-4">
                  <p className="skin-control-label">
                    {config.copy.adjustSource}
                  </p>
                  <button
                    type="button"
                    className="min-h-10 border border-lime-300/70 bg-lime-300/10 px-3 text-left text-sm text-lime-100 hover:bg-lime-300/20 disabled:cursor-wait disabled:opacity-60"
                    onClick={() => void improveWithAi()}
                    disabled={aiImproving}
                  >
                    {aiImproving ? m.skin_ai_analyzing() : m.skin_ai_improve()}
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
          </details>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            {config.copy.localNote}
          </p>
          {source && (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="mt-3 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              onClick={() => {
                trackSkinEvent({
                  name: 'skin_retry_started',
                  payload: { location: 'generator_workspace' },
                });
                setSource(undefined);
                setSourceName(undefined);
                setSourcePreview(undefined);
                setTexture(undefined);
                setStatus(config.copy.status.idle);
              }}
              aria-label={config.copy.reset}
            >
              <IconRefresh />
            </Button>
          )}
        </div>
        <div className="skin-output-v51 min-w-0 p-4 sm:p-6">
          <SkinPreview3d skinUrl={skinUrl} label={config.copy.preview3dLabel} />
          <details className="texture-map-v51 mt-3">
            <summary>Texture map</summary>
            <div className="skin-flat-v51 relative mt-3 grid min-h-80 place-items-center overflow-auto border border-zinc-800 bg-zinc-900 p-4">
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
          </details>
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
              <p className="skin-ready-v51 mt-4 border-l-2 border-green-400 bg-green-400/5 pl-3 py-2 text-sm leading-6 text-zinc-300">
                <strong className="text-green-400">
                  ✓ {m.skin_ready_download()}
                </strong>{' '}
                {m.skin_inspect_before_download()}
              </p>
            </>
          )}
          {aiTask && (
            <div className="mt-6">
              <SkinTaskCard
                task={aiTask}
                model={aiModel}
                onTaskReplace={setAiTask}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={aiPanelOpen} onOpenChange={setAiPanelOpen}>
        <DialogContent className="border border-cyan-300/30 bg-zinc-950 text-zinc-100">
          <DialogTitle>AI 版本：让它真的像你</DialogTitle>
          <DialogDescription>
            照片会发送给第三方 AI 模型；源照片最多保留 7 天。
          </DialogDescription>
          <form
            className="grid gap-4"
            onSubmit={(event) => void submitAi(event)}
          >
            <label className="grid gap-2 text-sm">
              照片（JPG、PNG、WebP，最大 10MB）
              <input
                required
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setAiFile(event.target.files?.[0])}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`min-h-10 border ${aiModel === 'classic' ? 'border-cyan-300 text-cyan-100' : 'border-zinc-700 text-zinc-400'}`}
                onClick={() => setAiModel('classic')}
              >
                Classic
              </button>
              <button
                type="button"
                className={`min-h-10 border ${aiModel === 'slim' ? 'border-cyan-300 text-cyan-100' : 'border-zinc-700 text-zinc-400'}`}
                onClick={() => setAiModel('slim')}
              >
                Slim
              </button>
            </div>
            <label className="grid gap-2 text-sm">
              主体
              <select
                value={aiSubject}
                onChange={(event) =>
                  setAiSubject(event.target.value as 'person' | 'pet')
                }
                className="min-h-10 border border-zinc-700 bg-zinc-900 px-2"
              >
                <option value="person">人物</option>
                <option value="pet">宠物</option>
              </select>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={aiConsent}
                onChange={(event) => setAiConsent(event.target.checked)}
              />
              我同意照片会发送给第三方 AI
            </label>
            <p className="text-xs text-zinc-500">
              1 credit · $4.99/20 或 $9.99/60
            </p>
            {aiError && <p className="text-sm text-red-300">{aiError}</p>}
            <Button type="submit">生成 AI 皮肤</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
        <DialogContent className="ai-dialog-v51 border border-cyan-300/30 bg-zinc-950 text-zinc-100">
          <DialogTitle>{m.skin_ai_hd_title()}</DialogTitle>
          <DialogDescription>
            {m.skin_ai_hd_description({ price: aiHdFromPriceUsd.toFixed(2) })}
          </DialogDescription>
          {waitlistDone ? (
            <output>{m.skin_waitlist_done()}</output>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(event) => void submitWaitlist(event)}
            >
              <label className="grid gap-1 text-sm">
                {m.skin_waitlist_email()}
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={waitlistEmail}
                  onChange={(event) => setWaitlistEmail(event.target.value)}
                  className="min-h-11 border border-zinc-700 bg-zinc-900 px-3"
                />
              </label>
              <label className="absolute -left-[10000px]" aria-hidden="true">
                Leave blank
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </label>
              <Button type="submit">{m.skin_waitlist_join()}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={importGuideOpen} onOpenChange={setImportGuideOpen}>
        <DialogContent className="border border-cyan-300/30 bg-zinc-950 text-zinc-100">
          <DialogTitle>{m.skin_import_title()}</DialogTitle>
          <DialogDescription>{m.skin_import_description()}</DialogDescription>
        </DialogContent>
      </Dialog>
    </section>
  );
}
