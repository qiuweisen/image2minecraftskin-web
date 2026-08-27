import { IconCube3dSphere, IconRefresh, IconUpload } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  skinViewerConfig,
  type ViewerModel,
} from '@/config/skin-viewer-config';
import {
  drawTexture,
  fileToImageSource,
  textureToDataUrl,
} from '@/lib/skin/browser';
import { mapImageToSkin } from '@/lib/skin/normalize';
import type { ImageSource, SkinTexture } from '@/lib/skin/types';
import { inspectSkinImage, type SkinImageInfo } from '@/lib/skin/viewer';
import { SkinPreview3d } from './skin-preview-3d';

function viewerExampleSource(): ImageSource {
  return {
    width: 3,
    height: 6,
    pixels: new Uint8ClampedArray([
      48, 30, 34, 255, 224, 157, 113, 255, 48, 30, 34, 255, 224, 157, 113, 255,
      85, 222, 216, 255, 224, 157, 113, 255, 27, 91, 99, 255, 168, 221, 69, 255,
      27, 91, 99, 255, 27, 91, 99, 255, 27, 91, 99, 255, 27, 91, 99, 255, 38,
      54, 63, 255, 38, 54, 63, 255, 38, 54, 63, 255, 241, 243, 237, 255, 38, 54,
      63, 255, 241, 243, 237, 255,
    ]),
  };
}

export function SkinViewerWorkspace() {
  const { workspace } = skinViewerConfig;
  const inputRef = useRef<HTMLInputElement>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [texture, setTexture] = useState<SkinTexture>();
  const [skinUrl, setSkinUrl] = useState<string>();
  const [info, setInfo] = useState<SkinImageInfo>();
  const [fileName, setFileName] = useState<string>();
  const [model, setModel] = useState<ViewerModel>('auto-detect');
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState(workspace.idle);
  const [error, setError] = useState<string>();

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!texture || !textureCanvasRef.current) return;
    drawTexture(
      textureCanvasRef.current,
      texture,
      texture.format === 'java-64' ? 5 : 3
    );
  }, [texture]);

  const showTexture = useCallback(
    (nextTexture: SkinTexture, nextInfo: SkinImageInfo, nextName: string) => {
      setTexture(nextTexture);
      setSkinUrl(textureToDataUrl(nextTexture));
      setInfo(nextInfo);
      setFileName(nextName);
      setStatus(workspace.ready);
      setError(undefined);
    },
    [workspace.ready]
  );

  const loadFile = useCallback(
    async (file?: File) => {
      if (!file) return;
      if (file.size > workspace.maxFileSizeBytes) {
        setError('Choose a PNG file smaller than 2 MB.');
        setStatus('Invalid file');
        return;
      }

      setStatus('Checking skin');
      setError(undefined);
      try {
        const source = await fileToImageSource(file);
        const nextInfo = inspectSkinImage(
          file.type,
          source.width,
          source.height
        );
        showTexture(
          {
            ...source,
            format: nextInfo.format,
            model: model === 'slim' ? 'slim' : 'classic',
          },
          nextInfo,
          file.name
        );
      } catch (nextError) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'The skin could not be opened.'
        );
        setStatus('Invalid skin');
      }
    },
    [model, showTexture, workspace.maxFileSizeBytes]
  );

  const loadExample = () => {
    const nextTexture = mapImageToSkin(
      viewerExampleSource(),
      'java-64',
      'classic'
    );
    showTexture(
      nextTexture,
      { format: 'java-64', label: 'Java 64x64' },
      'example-skin.png'
    );
  };

  const reset = () => {
    setTexture(undefined);
    setSkinUrl(undefined);
    setInfo(undefined);
    setFileName(undefined);
    setModel('auto-detect');
    setStatus(workspace.idle);
    setError(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <section
      aria-label={workspace.label}
      className="overflow-hidden border border-[#2a7378] bg-[#11191b] text-[#f1f3ed] shadow-2xl shadow-black/40"
    >
      <header className="flex min-h-12 items-center justify-between gap-4 border-b border-[#21464a] px-4 font-mono text-xs uppercase text-[#36d8d4] sm:px-6">
        <span className="flex items-center gap-2">
          <IconCube3dSphere className="size-4" /> {workspace.title}
        </span>
        <span
          aria-live="polite"
          className={error ? 'text-[#f28b72]' : 'text-[#8d9a9a]'}
        >
          {status}
        </span>
      </header>

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="border-b border-[#21464a] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <button
            type="button"
            disabled={!hydrated}
            className="grid min-h-48 w-full place-items-center border border-dashed border-[#2a7378] bg-[#0b1011] p-5 text-center transition-colors hover:bg-[#162326] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#36d8d4]"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void loadFile(event.dataTransfer.files[0]);
            }}
          >
            <span className="grid justify-items-center gap-2">
              <IconUpload className="size-7 text-[#36d8d4]" />
              <strong>{workspace.uploadTitle}</strong>
              <span className="max-w-48 text-xs leading-5 text-[#8d9a9a]">
                {workspace.uploadHint}
              </span>
            </span>
          </button>
          <input
            ref={inputRef}
            hidden
            disabled={!hydrated}
            type="file"
            accept="image/png,.png"
            onChange={(event) => void loadFile(event.target.files?.[0])}
          />

          <Button
            type="button"
            variant="outline"
            className="mt-3 h-11 w-full rounded-sm border-[#2a7378] bg-transparent text-[#f1f3ed] hover:bg-[#162326] hover:text-[#f1f3ed]"
            disabled={!hydrated}
            onClick={loadExample}
          >
            {workspace.example}
          </Button>

          <fieldset className="mt-6">
            <legend className="font-mono text-xs uppercase text-[#8d9a9a]">
              {workspace.modelLabel}
            </legend>
            <div className="mt-2 grid grid-cols-3">
              {workspace.models.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={!hydrated}
                  data-active={model === option.value}
                  className="min-h-11 border border-r-0 border-[#21464a] px-2 font-mono text-xs text-[#8d9a9a] last:border-r data-[active=true]:border-[#36d8d4] data-[active=true]:bg-[#36d8d4] data-[active=true]:text-[#0b1011]"
                  onClick={() => setModel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <dl className="mt-6 divide-y divide-[#21464a] border-y border-[#21464a] text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-[#8d9a9a]">File</dt>
              <dd className="max-w-40 truncate font-mono text-xs">
                {fileName ?? '-'}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-[#8d9a9a]">Format</dt>
              <dd className="font-mono text-xs text-[#a8dd45]">
                {info?.label ?? '-'}
              </dd>
            </div>
          </dl>

          {error ? (
            <p role="alert" className="mt-4 text-sm leading-6 text-[#f28b72]">
              {error}
            </p>
          ) : (
            <p className="mt-4 text-xs leading-5 text-[#8d9a9a]">
              {workspace.localNote}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            className="mt-5 h-11 w-full rounded-sm border-[#21464a] bg-transparent text-[#8d9a9a] hover:bg-[#162326] hover:text-[#f1f3ed]"
            disabled={!hydrated}
            onClick={reset}
          >
            <IconRefresh /> {workspace.reset}
          </Button>
        </div>

        <div className="grid min-w-0 gap-px bg-[#21464a] xl:grid-cols-[1.08fr_0.92fr]">
          <div className="relative grid min-h-[480px] place-items-center bg-[#0b1011] p-4 sm:p-6">
            <SkinPreview3d
              skinUrl={skinUrl}
              label={workspace.previewLabel}
              model={model}
            />
            {!skinUrl && (
              <p className="pointer-events-none absolute bottom-8 max-w-64 text-center text-sm text-[#8d9a9a]">
                {workspace.emptyPreview}
              </p>
            )}
          </div>
          <div className="grid min-h-[480px] place-items-center overflow-auto bg-[#11191b] p-4 sm:p-6">
            <canvas
              ref={textureCanvasRef}
              className="max-w-full [image-rendering:pixelated]"
              aria-label={workspace.textureLabel}
            />
            {!texture && (
              <span className="font-mono text-xs uppercase text-[#8d9a9a]">
                2D texture waiting
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
