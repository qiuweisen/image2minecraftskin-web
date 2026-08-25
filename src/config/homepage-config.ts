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
  };
}
