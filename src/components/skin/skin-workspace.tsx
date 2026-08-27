import { IconDownload, IconRefresh, IconUpload } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSkinToolConfig } from '@/config/skin-tool-config';
import {
  drawTexture,
  fileToImageSource,
  textureToDataUrl,
} from '@/lib/skin/browser';
import { exportSkinTexture, skinFilename } from '@/lib/skin/export';
import { mapImageToSkin } from '@/lib/skin/normalize';
import type {
  ImageSource,
  SkinFormat,
  SkinModel,
  SkinTexture,
} from '@/lib/skin/types';
import { SkinPreview3d } from './skin-preview-3d';

function exampleSource(): ImageSource {
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

  const generate = useCallback(
    (nextSource: ImageSource, nextFormat = format, nextModel = model) => {
      setStatus(config.copy.status.processing);
      setError(false);
      requestAnimationFrame(() => {
        try {
          const mapped = mapImageToSkin(nextSource, nextFormat, nextModel);
          setTexture(mapped);
          setStatus(config.copy.status.complete);
        } catch {
          setStatus(config.copy.status.error);
          setError(true);
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
    const nextSource = exampleSource();
    setSource(nextSource);
    generate(nextSource);
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
        return;
      }
      try {
        const nextSource = await fileToImageSource(file);
        setSource(nextSource);
        setSourcePreview(URL.createObjectURL(file));
        generate(nextSource);
      } catch {
        setStatus(config.copy.status.error);
        setError(true);
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

  const loadExample = () => {
    const nextSource = exampleSource();
    setSource(nextSource);
    setSourcePreview(undefined);
    generate(nextSource);
  };

  const changeFormat = (nextFormat: SkinFormat) => {
    setFormat(nextFormat);
    if (source) generate(source, nextFormat, model);
  };

  const changeModel = (nextModel: SkinModel) => {
    setModel(nextModel);
    if (source) generate(source, format, nextModel);
  };

  const download = () => {
    if (!texture) return;
    const exported = exportSkinTexture(texture, format);
    const url = textureToDataUrl(exported);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = skinFilename(format);
    anchor.click();
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
        </div>
      </div>
    </section>
  );
}
