import { IconDownload, IconRefresh, IconUpload } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
      className="skin-workspace"
      aria-label={config.copy.workspaceLabel}
    >
      <header className="skin-workspace-bar">
        <span>
          <i className="skin-pulse" /> {config.copy.previewTitle}
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
            <strong>{config.copy.uploadTitle}</strong>
            <span>{config.copy.uploadHint}</span>
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
            className="skin-example-button"
            onClick={loadExample}
          >
            {config.copy.exampleLabel}
          </button>
          {sourcePreview && (
            <img
              className="skin-source-preview"
              src={sourcePreview}
              alt={config.copy.sourceAlt}
            />
          )}
          <fieldset className="skin-control-group">
            <legend>{config.copy.formatLabel}</legend>
            <div className="skin-segmented">
              {config.formats.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={format === option.value ? 'is-active' : ''}
                  onClick={() => changeFormat(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="skin-control-group">
            <legend>{config.copy.modelLabel}</legend>
            <div className="skin-segmented">
              {config.models.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={model === option.value ? 'is-active' : ''}
                  onClick={() => changeModel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="skin-privacy">{config.copy.localNote}</p>
          <div className="skin-actions">
            <button
              type="button"
              className="skin-download"
              disabled={!texture}
              onClick={download}
            >
              <IconDownload /> {config.copy.download}
            </button>
            <button
              type="button"
              className="skin-reset"
              onClick={() => {
                setSource(undefined);
                setSourcePreview(undefined);
                setTexture(undefined);
                setStatus(config.copy.status.idle);
              }}
              aria-label={config.copy.reset}
            >
              <IconRefresh />
            </button>
          </div>
        </div>
        <div className="skin-output">
          <div className="skin-output-grid">
            <SkinPreview3d
              skinUrl={skinUrl}
              label={config.copy.preview3dLabel}
            />
            <div className="skin-flat-preview">
              <canvas ref={canvasRef} aria-label={config.copy.textureLabel} />
              {!texture && <p>{config.copy.previewEmpty}</p>}
            </div>
          </div>
          <div className="skin-output-meta">
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
