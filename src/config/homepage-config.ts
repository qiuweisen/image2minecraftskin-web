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
        eyebrow: 'What is it?',
        title: 'Turn an image into a Minecraft skin',
        description:
          'image2minecraftskin is a focused browser tool for turning portraits, character art, and pixel art into downloadable Minecraft skin textures.',
      },
      features: [
        {
          title: 'Local by default',
          description:
            'Your source image stays in the browser during standard conversion.',
        },
        {
          title: 'Java and Bedrock',
          description: 'Export Java 64x64 or Bedrock 128x128 PNG textures.',
        },
        {
          title: '2D and 3D preview',
          description:
            'Inspect the unfolded texture and character before downloading.',
        },
        {
          title: 'No account required',
          description: 'Create a skin and download it without signup.',
        },
      ],
      featuresHeading: {
        eyebrow: 'Key features',
        title: 'Everything needed for a usable skin',
        description:
          'A short path from source image to a texture you can use in Minecraft.',
      },
      compatibilityHeading: {
        eyebrow: 'Output formats',
        description:
          'Choose the format that matches the edition and model you play.',
      },
      faqHeading: {
        eyebrow: 'FAQ',
        description:
          'Clear answers about files, privacy, compatibility, and the download flow.',
      },
      howToUse: {
        eyebrow: 'How to use',
        title: 'Four steps, no learning curve',
        description:
          'The generator keeps the first result simple and leaves advanced editing out of the way.',
        steps: [
          {
            number: '01',
            title: 'Upload an image',
            description: 'Choose a PNG, JPG, JPEG, or WEBP image up to 10 MB.',
          },
          {
            number: '02',
            title: 'Choose your output',
            description:
              'Select Java or Bedrock and choose the classic or slim model.',
          },
          {
            number: '03',
            title: 'Check the preview',
            description:
              'Review the generated texture and 3D character preview.',
          },
          {
            number: '04',
            title: 'Download the PNG',
            description: 'Save the finished skin and import it into Minecraft.',
          },
        ],
      },
      trust: {
        eyebrow: 'Built for the result',
        title: 'A practical skin workflow',
        description:
          'No gallery, marketplace, or account layer gets in the way. The page is focused on making and exporting one usable skin.',
      },
      cta: {
        eyebrow: 'Ready to create?',
        title: 'Make your next Minecraft skin from an image.',
        button: 'Open the generator',
      },
    },
  };
}
