import { IconDownload, IconRefresh, IconUpload } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { m } from '@/locale/paraglide/messages';
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

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

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
  context.fillStyle = '#c7f36b';
  context.fillRect(50, 42, 140, 122);
  context.fillStyle = '#081013';
  context.fillRect(78, 78, 22, 22);
  context.fillRect(140, 78, 22, 22);
  context.fillStyle = '#72e5e0';
  context.fillRect(92, 122, 56, 18);
  const image = context.getImageData(0, 0, width, height);
  return { width, height, pixels: image.data };
}

export function SkinWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState<ImageSource>();
  const [sourcePreview, setSourcePreview] = useState<string>();
  const [format, setFormat] = useState<SkinFormat>('java-64');
  const [model, setModel] = useState<SkinModel>('classic');
  const [texture, setTexture] = useState<SkinTexture>();
  const [status, setStatus] = useState(() => m.skin_status_idle());
  const [error, setError] = useState(false);

  const generate = useCallback(
    (nextSource: ImageSource, nextFormat = format, nextModel = model) => {
      setStatus(m.skin_status_processing());
      setError(false);
      requestAnimationFrame(() => {
        try {
          const mapped = mapImageToSkin(nextSource, nextFormat, nextModel);
          setTexture(mapped);
          setStatus(m.skin_status_complete());
        } catch {
          setStatus(m.skin_status_error());
          setError(true);
        }
      });
    },
    [format, model]
  );

  useEffect(() => {
    if (texture && canvasRef.current)
      drawTexture(canvasRef.current, texture, format === 'java-64' ? 5 : 3);
  }, [texture, format]);

  const loadSource = useCallback(
    async (file?: File) => {
      if (
        !file ||
        !ACCEPTED_TYPES.includes(file.type) ||
        file.size > 10 * 1024 * 1024
      ) {
        setStatus(m.skin_status_invalid());
        setError(true);
        return;
      }
      try {
        const nextSource = await fileToImageSource(file);
        setSource(nextSource);
        setSourcePreview(URL.createObjectURL(file));
        generate(nextSource);
      } catch {
        setStatus(m.skin_status_error());
        setError(true);
      }
    },
    [generate]
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
      className="skin-workspace"
      aria-label="Minecraft skin generator"
    >
      <header className="skin-workspace-bar">
        <span>
          <i className="skin-pulse" /> {m.skin_preview_title()}
        </span>
        <span className={error ? 'skin-status is-error' : 'skin-status'}>
          {status}
        </span>
      </header>
      <div className="skin-workspace-grid">
        <div className="skin-controls">
          <button
            type="button"
            className="skin-drop"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void loadSource(event.dataTransfer.files[0]);
            }}
          >
            <IconUpload />
            <strong>{m.skin_upload_title()}</strong>
            <span>{m.skin_upload_hint()}</span>
          </button>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={(event) => void loadSource(event.target.files?.[0])}
          />
          <button
            type="button"
            className="skin-example-button"
            onClick={loadExample}
          >
            {m.skin_example_label()}
          </button>
          {sourcePreview && (
            <img
              className="skin-source-preview"
              src={sourcePreview}
              alt="Uploaded source"
            />
          )}
          <fieldset className="skin-control-group">
            <legend>{m.skin_format_label()}</legend>
            <div className="skin-segmented">
              <button
                type="button"
                className={format === 'java-64' ? 'is-active' : ''}
                onClick={() => changeFormat('java-64')}
              >
                {m.skin_java()}
              </button>
              <button
                type="button"
                className={format === 'bedrock-128' ? 'is-active' : ''}
                onClick={() => changeFormat('bedrock-128')}
              >
                {m.skin_bedrock()}
              </button>
            </div>
          </fieldset>
          <fieldset className="skin-control-group">
            <legend>{m.skin_model_label()}</legend>
            <div className="skin-segmented">
              <button
                type="button"
                className={model === 'classic' ? 'is-active' : ''}
                onClick={() => changeModel('classic')}
              >
                {m.skin_classic()}
              </button>
              <button
                type="button"
                className={model === 'slim' ? 'is-active' : ''}
                onClick={() => changeModel('slim')}
              >
                {m.skin_slim()}
              </button>
            </div>
          </fieldset>
          <p className="skin-privacy">{m.skin_local_note()}</p>
          <div className="skin-actions">
            <button
              type="button"
              className="skin-download"
              disabled={!texture}
              onClick={download}
            >
              <IconDownload /> {m.skin_download()}
            </button>
            <button
              type="button"
              className="skin-reset"
              onClick={() => {
                setSource(undefined);
                setSourcePreview(undefined);
                setTexture(undefined);
                setStatus(m.skin_status_idle());
              }}
              aria-label={m.skin_reset()}
            >
              <IconRefresh />
            </button>
          </div>
        </div>
        <div className="skin-output">
          <div className="skin-output-grid">
            <SkinPreview3d skinUrl={skinUrl} />
            <div className="skin-flat-preview">
              <canvas ref={canvasRef} aria-label="2D unfolded skin texture" />
              {!texture && <p>{m.skin_preview_empty()}</p>}
            </div>
          </div>
          <div className="skin-output-meta">
            <span>
              {format === 'java-64' ? m.skin_java() : m.skin_bedrock()}
            </span>
            <span>
              {model === 'classic' ? m.skin_classic() : m.skin_slim()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
