import { m } from '@/locale/paraglide/messages';

export type ViewerModel = 'auto-detect' | 'default' | 'slim';

export const skinViewerConfig = {
  path: '/minecraft-skin-viewer',
  seo: {
    title: m.viewer_seo_title(),
    description: m.viewer_seo_description(),
  },
  hero: {
    kicker: m.viewer_hero_kicker(),
    title: m.viewer_hero_title(),
    description: m.viewer_hero_description(),
    facts: [m.viewer_fact_sizes(), m.viewer_fact_local(), m.viewer_fact_no_signup()],
  },
  workspace: {
    maxFileSizeBytes: 2 * 1024 * 1024,
    label: m.viewer_workspace_label(), title: m.viewer_workspace_title(), idle: m.viewer_workspace_idle(), ready: m.viewer_workspace_ready(), uploadTitle: m.viewer_workspace_upload_title(), uploadHint: m.viewer_workspace_upload_hint(), example: m.viewer_workspace_example(), reset: m.viewer_workspace_reset(), localNote: m.viewer_workspace_local_note(), modelLabel: m.viewer_workspace_model(), textureLabel: m.viewer_workspace_texture(), previewLabel: m.viewer_workspace_preview(), emptyPreview: m.viewer_workspace_empty(),
    models: [
      { value: 'auto-detect', label: m.viewer_model_auto() }, { value: 'default', label: m.viewer_model_classic() }, { value: 'slim', label: m.viewer_model_slim() },
    ] satisfies Array<{ value: ViewerModel; label: string }>,
  },
  explanation: {
    eyebrow: m.viewer_explanation_eyebrow(), title: m.viewer_explanation_title(), description: m.viewer_explanation_description(),
  },
  steps: [
    {
      number: '01',
      title: m.viewer_step1_title(), description: m.viewer_step1_description(),
    },
    {
      number: '02',
      title: m.viewer_step2_title(), description: m.viewer_step2_description(),
    },
    {
      number: '03',
      title: m.viewer_step3_title(), description: m.viewer_step3_description(),
    },
  ],
  formats: [
    {
      size: '64',
      title: m.viewer_format_java_title(), description: m.viewer_format_java_description(),
    },
    {
      size: '128',
      title: m.viewer_format_bedrock_title(), description: m.viewer_format_bedrock_description(),
    },
  ],
  faqs: [
    {
      question: m.viewer_faq1_q(), answer: m.viewer_faq1_a(),
    },
    {
      question: m.viewer_faq2_q(), answer: m.viewer_faq2_a(),
    },
    {
      question: m.viewer_faq3_q(), answer: m.viewer_faq3_a(),
    },
    {
      question: m.viewer_faq4_q(), answer: m.viewer_faq4_a(),
    },
  ],
  cta: {
    eyebrow: m.viewer_cta_eyebrow(), title: m.viewer_cta_title(), description: m.viewer_cta_description(), button: m.viewer_cta_button(),
  },
} as const;
