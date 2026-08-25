import { m } from '@/locale/paraglide/messages';
import type { SkinFormat, SkinModel } from '@/lib/skin/types';

export interface SkinToolConfig {
  acceptedTypes: string[];
  maxFileSizeBytes: number;
  defaultFormat: SkinFormat;
  defaultModel: SkinModel;
  formats: Array<{ value: SkinFormat; label: string; size: number }>;
  models: Array<{ value: SkinModel; label: string }>;
  copy: {
    workspaceLabel: string;
    previewTitle: string;
    uploadTitle: string;
    uploadHint: string;
    exampleLabel: string;
    formatLabel: string;
    modelLabel: string;
    localNote: string;
    download: string;
    reset: string;
    previewEmpty: string;
    sourceAlt: string;
    textureLabel: string;
    status: {
      idle: string;
      processing: string;
      complete: string;
      invalid: string;
      error: string;
    };
  };
}

export function getSkinToolConfig(): SkinToolConfig {
  return {
    acceptedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxFileSizeBytes: 10 * 1024 * 1024,
    defaultFormat: 'java-64',
    defaultModel: 'classic',
    formats: [
      { value: 'java-64', label: m.skin_java(), size: 64 },
      { value: 'bedrock-128', label: m.skin_bedrock(), size: 128 },
    ],
    models: [
      { value: 'classic', label: m.skin_classic() },
      { value: 'slim', label: m.skin_slim() },
    ],
    copy: {
      workspaceLabel: m.skin_workspace_label(),
      previewTitle: m.skin_preview_title(),
      uploadTitle: m.skin_upload_title(),
      uploadHint: m.skin_upload_hint(),
      exampleLabel: m.skin_example_label(),
      formatLabel: m.skin_format_label(),
      modelLabel: m.skin_model_label(),
      localNote: m.skin_local_note(),
      download: m.skin_download(),
      reset: m.skin_reset(),
      previewEmpty: m.skin_preview_empty(),
      sourceAlt: m.skin_source_alt(),
      textureLabel: m.skin_texture_label(),
      status: {
        idle: m.skin_status_idle(),
        processing: m.skin_status_processing(),
        complete: m.skin_status_complete(),
        invalid: m.skin_status_invalid(),
        error: m.skin_status_error(),
      },
    },
  };
}
