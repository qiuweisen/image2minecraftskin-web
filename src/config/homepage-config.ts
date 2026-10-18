import { m } from '@/locale/paraglide/messages';

export type HomepageSectionId =
  | 'generator'
  | 'examples'
  | 'compatibility'
  | 'faq';

export interface HomepageConfig {
  hero: {
    kicker: string;
    title: string;
    text: string;
    facts: string[];
    proofLabel: string;
  };
  sections: Array<{ id: HomepageSectionId; enabled: boolean }>;
  examples: Array<{
    visualClassName: string;
    title: string;
    description: string;
  }>;
  sectionTitles: {
    examples: string;
    compatibility: string;
    faq: string;
  };
  compatibility: Array<{
    size: number;
    title: string;
    description: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  landing: {
    whatIs: { eyebrow: string; title: string; description: string };
    features: Array<{ title: string; description: string }>;
    featuresHeading: { eyebrow: string; title: string; description: string };
    compatibilityHeading: {
      eyebrow: string;
      description: string;
    };
    faqHeading: { eyebrow: string; description: string };
    howToUse: {
      eyebrow: string;
      title: string;
      description: string;
      steps: Array<{ number: string; title: string; description: string }>;
    };
    trust: { eyebrow: string; title: string; description: string };
    viewerHandoff: {
      eyebrow: string;
      title: string;
      description: string;
      button: string;
    };
    cta: { eyebrow: string; title: string; button: string };
  };
}

export function getHomepageConfig(): HomepageConfig {
  return {
    hero: {
      kicker: m.skin_hero_kicker(),
      title: m.skin_hero_title(),
      text: m.skin_hero_text(),
      facts: [m.skin_meta_sizes(), m.skin_meta_local(), m.skin_meta_signup()],
      proofLabel: m.skin_proof_label(),
    },
    sections: [
      { id: 'generator', enabled: true },
      { id: 'examples', enabled: true },
      { id: 'compatibility', enabled: true },
      { id: 'faq', enabled: true },
    ],
    examples: [
      {
        visualClassName: 'skin-example-portrait',
        title: m.skin_example_portrait(),
        description: m.skin_example_portrait_hint(),
      },
      {
        visualClassName: 'skin-example-character',
        title: m.skin_example_character(),
        description: m.skin_example_character_hint(),
      },
      {
        visualClassName: 'skin-example-pixels',
        title: m.skin_example_pixel(),
        description: m.skin_example_pixel_hint(),
      },
    ],
    sectionTitles: {
      examples: m.skin_examples_title(),
      compatibility: m.skin_compat_title(),
      faq: m.skin_faq_title(),
    },
    compatibility: [
      {
        size: 64,
        title: m.skin_java(),
        description: m.skin_compat_java_body(),
      },
      {
        size: 128,
        title: m.skin_bedrock(),
        description: m.skin_compat_bedrock_body(),
      },
    ],
    faqs: [
      {
        question: m.skin_faq_privacy_question(),
        answer: m.skin_faq_privacy_answer(),
      },
      {
        question: m.skin_faq_formats_question(),
        answer: m.skin_faq_formats_answer(),
      },
      {
        question: m.skin_faq_mobile_question(),
        answer: m.skin_faq_mobile_answer(),
      },
      {
        question: m.skin_faq_free_question(),
        answer: m.skin_faq_free_answer(),
      },
    ],
    landing: {
      whatIs: {
        eyebrow: m.landing_what_eyebrow(),
        title: m.landing_what_title(),
        description: m.landing_what_description(),
      },
      features: [
        {
          title: m.landing_feature_local_title(),
          description: m.landing_feature_local_description(),
        },
        {
          title: m.landing_feature_formats_title(),
          description: m.landing_feature_formats_description(),
        },
        {
          title: m.landing_feature_preview_title(),
          description: m.landing_feature_preview_description(),
        },
        {
          title: m.landing_feature_account_title(),
          description: m.landing_feature_account_description(),
        },
      ],
      featuresHeading: {
        eyebrow: m.landing_features_eyebrow(),
        title: m.landing_features_title(),
        description: m.landing_features_description(),
      },
      compatibilityHeading: {
        eyebrow: m.landing_formats_eyebrow(),
        description: m.landing_formats_description(),
      },
      faqHeading: {
        eyebrow: m.landing_faq_eyebrow(),
        description: m.landing_faq_description(),
      },
      howToUse: {
        eyebrow: m.landing_how_eyebrow(),
        title: m.landing_how_title(),
        description: m.landing_how_description(),
        steps: [
          {
            number: '01',
            title: m.landing_step1_title(),
            description: m.landing_step1_description(),
          },
          {
            number: '02',
            title: m.landing_step2_title(),
            description: m.landing_step2_description(),
          },
          {
            number: '03',
            title: m.landing_step3_title(),
            description: m.landing_step3_description(),
          },
          {
            number: '04',
            title: m.landing_step4_title(),
            description: m.landing_step4_description(),
          },
        ],
      },
      trust: {
        eyebrow: m.landing_trust_eyebrow(),
        title: m.landing_trust_title(),
        description: m.landing_trust_description(),
      },
      viewerHandoff: {
        eyebrow: m.landing_viewer_eyebrow(),
        title: m.landing_viewer_title(),
        description: m.landing_viewer_description(),
        button: m.landing_viewer_button(),
      },
      cta: {
        eyebrow: m.landing_cta_eyebrow(),
        title: m.landing_cta_title(),
        button: m.landing_cta_button(),
      },
    },
  };
}
