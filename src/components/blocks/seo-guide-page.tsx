import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { m } from '@/locale/paraglide/messages';

type Kind = 'converter' | 'formats';
type Page = {
  kicker: string;
  title: string;
  description: string;
  answer: string;
  steps: readonly (readonly [string, string, string])[];
  sections: readonly (readonly [string, string])[];
  faqs: readonly (readonly [string, string])[];
};

// Keep all page copy in one locale-ready dictionary. When a locale is added to
// Paraglide, add the translated entries here (or move them into messages/*.json)
// without changing the shared layout below.
const pages: Record<Kind, Page> = {
  converter: {
    kicker: 'Image to Minecraft Skin Converter',
    title: 'Turn a picture into a Minecraft skin PNG',
    description:
      'Convert a portrait, character illustration, or pixel-art image into a Minecraft skin online. Choose Java 64×64 or Bedrock 128×128, preview the result, and download the PNG in your browser.',
    answer:
      'An image-to-Minecraft-skin converter maps a PNG, JPG, JPEG, or WEBP image onto a Minecraft skin texture. image2minecraftskin runs the conversion locally, supports Java 64×64 and Bedrock 128×128 exports, and requires no account.',
    steps: [
      [
        '01',
        'Choose a source image',
        'Use a centered portrait or character image with a simple background.',
      ],
      [
        '02',
        'Select the edition',
        'Choose Java 64×64 or Bedrock 128×128, then select Classic or Slim arms.',
      ],
      [
        '03',
        'Preview and download',
        'Check the texture and 3D character preview before saving the PNG.',
      ],
    ],
    sections: [
      [
        'Prepare an image that converts cleanly',
        'Use one centered subject, a square crop, and a simple background. The framing controls can correct zoom and position before you download.',
      ],
      [
        'Privacy and processing',
        'Standard conversion runs in your browser. The source image is not uploaded or stored, and no account is required.',
      ],
    ],
    faqs: [
      [
        'What image formats are supported?',
        'PNG, JPG, JPEG, and WEBP images up to 10 MB are supported.',
      ],
      [
        'Which output should I choose?',
        'Use Java 64×64 for PC, Mac, or Linux. Use Bedrock 128×128 for mobile and consoles.',
      ],
      [
        'Is this an AI image generator?',
        'No. It maps an existing image into a skin texture; it does not generate new artwork.',
      ],
    ],
  },
  formats: {
    kicker: 'Minecraft Skin Formats',
    title: 'Minecraft skin size and format guide',
    description:
      'Learn the difference between Java 64×64 and Bedrock 128×128 Minecraft skins, plus Classic and Slim arm models, before you create or import a skin.',
    answer:
      'Modern Minecraft skins use a square PNG texture. Java Edition commonly uses 64×64 pixels, while Bedrock Edition supports 128×128 pixels. Classic skins have four-pixel arms; Slim skins have three-pixel arms.',
    steps: [
      [
        '01',
        'Java Edition',
        'Choose a 64×64 PNG for Minecraft Java Edition on desktop.',
      ],
      [
        '02',
        'Bedrock Edition',
        'Choose a 128×128 PNG for Bedrock on mobile and consoles.',
      ],
      [
        '03',
        'Arm model',
        'Use Classic for four-pixel arms or Slim for three-pixel arms.',
      ],
    ],
    sections: [
      [
        'Why dimensions matter',
        'The dimensions tell Minecraft how to read the texture layout. Validate a file before importing it when you are unsure which edition it targets.',
      ],
      [
        'Fix a skin that looks wrong',
        'A wrong arm width or shifted face usually points to a model mismatch. Switch between Classic and Slim, then compare the flat texture with the 3D model.',
      ],
    ],
    faqs: [
      [
        'Is a Minecraft skin 64×64 or 128×128?',
        'Java skins are commonly 64×64. Bedrock supports 128×128 for higher-resolution textures.',
      ],
      [
        'What is the difference between Classic and Slim?',
        'Classic uses four-pixel arms. Slim uses three-pixel arms and is sometimes called the Alex model.',
      ],
      [
        'Can I validate a skin before importing it?',
        'Yes. Upload it to the Minecraft Skin Viewer to validate dimensions and inspect it in 2D and 3D.',
      ],
    ],
  },
};

function localizedPage(kind: Kind): Page {
  const prefix = kind === 'converter' ? 'seo_converter' : 'seo_formats';
  const messages = m as unknown as Record<string, () => string>;
  const fallback = pages[kind];
  const get = (key: string) => {
    const translated = messages[`${prefix}_${key}`]?.();
    if (translated && translated !== `${prefix}_${key}`) return translated;
    if (key === 'kicker') return fallback.kicker;
    if (key === 'title') return fallback.title;
    if (key === 'description') return fallback.description;
    if (key === 'answer') return fallback.answer;
    const match = key.match(/^(step|section|faq)([1-3])_(title|text|q|a)$/);
    if (match) {
      const index = Number(match[2]) - 1;
      const values =
        match[1] === 'step'
          ? fallback.steps[index]
          : match[1] === 'section'
            ? fallback.sections[index]
            : fallback.faqs[index];
      return (
        values?.[
          match[1] === 'step'
            ? match[3] === 'title'
              ? 1
              : 2
            : match[3] === 'title' || match[3] === 'q'
              ? 0
              : 1
        ] ?? ''
      );
    }
    return '';
  };
  return {
    kicker: get('kicker'),
    title: get('title'),
    description: get('description'),
    answer: get('answer'),
    steps: [1, 2, 3].map(
      (n) => [`0${n}`, get(`step${n}_title`), get(`step${n}_text`)] as const
    ),
    sections: [1, 2].map(
      (n) => [get(`section${n}_title`), get(`section${n}_text`)] as const
    ),
    faqs: [1, 2, 3].map((n) => [get(`faq${n}_q`), get(`faq${n}_a`)] as const),
  };
}

export function SeoGuidePage({ kind }: { kind: Kind }) {
  const page = localizedPage(kind);
  return (
    <main className="bg-[#0b1011] text-[#f1f3ed]">
      <section className="border-b border-[#21464a] px-4 py-20 md:py-28">
        <Container className="px-2">
          <HeaderSection
            title={page.kicker}
            subtitle={page.title}
            subtitleAs="h1"
            description={page.description}
            className="items-start text-left"
            titleClassName="font-mono text-xs text-cyan-300"
            subtitleClassName="mt-2 max-w-4xl text-4xl font-semibold sm:text-6xl"
            descriptionClassName="max-w-3xl text-lg leading-8 text-[#8d9a9a]"
          />
          <p className="mt-8 max-w-3xl border-l-2 border-cyan-400 pl-4 leading-7 text-[#d7e1dc]">
            {page.answer}
          </p>
          <Link
            to="/"
            hash="generator"
            className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}
          >
            {m.seo_common_open_generator()} <IconArrowRight />
          </Link>
        </Container>
      </section>
      <section className="border-b border-[#21464a] px-4 py-16 md:py-24">
        <Container className="px-2">
          <HeaderSection
            title={m.seo_common_steps()}
            subtitle={m.seo_common_how_it_works()}
            className="items-start text-left"
            titleClassName="font-mono text-xs text-cyan-300"
            subtitleClassName="text-3xl font-semibold"
          />
          <ScrollReveal className="mt-10 grid border border-[#21464a] md:grid-cols-3">
            {page.steps.map(([number, title, text], index) => (
              <Card
                key={number}
                className="min-h-56 rounded-none border-0 border-r border-[#21464a] bg-[#11191b] ring-0 last:border-r-0"
              >
                <CardHeader className="p-7">
                  <span className="font-mono text-xs text-cyan-300">
                    {number}{' '}
                    {index === 2 && (
                      <IconCheck className="inline size-4 text-[#a8dd45]" />
                    )}
                  </span>
                  <CardTitle className="mt-8 text-xl text-[#f1f3ed]">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="leading-7 text-[#8d9a9a]">
                  {text}
                </CardContent>
              </Card>
            ))}
          </ScrollReveal>
        </Container>
      </section>
      <section className="border-b border-[#21464a] px-4 py-16">
        <Container className="grid gap-10 px-2 md:grid-cols-2">
          {page.sections.map(([title, text]) => (
            <article key={title}>
              <HeaderSection
                title={m.seo_common_practical_guide()}
                subtitle={title}
                className="items-start text-left"
                titleClassName="font-mono text-xs text-cyan-300"
                subtitleClassName="text-2xl font-semibold"
              />
              <p className="mt-5 leading-7 text-[#8d9a9a]">{text}</p>
            </article>
          ))}
        </Container>
      </section>
      <section className="px-4 py-16 md:py-24">
        <Container className="px-2">
          <HeaderSection
            title={m.seo_common_faq()}
            subtitle={m.seo_common_frequently_asked()}
            className="items-start text-left"
            titleClassName="font-mono text-xs text-cyan-300"
            subtitleClassName="text-3xl font-semibold"
          />
          <ScrollReveal className="mt-8 max-w-4xl border-y border-[#21464a]">
            <Accordion>
              {page.faqs.map(([question, answer], index) => (
                <AccordionItem key={question} value={`faq-${index}`}>
                  <AccordionTrigger className="py-5 text-left text-base hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 leading-7 text-[#8d9a9a]">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
          <Link
            to="/minecraft-skin-viewer"
            className="mt-12 inline-block text-cyan-300 underline underline-offset-4"
          >
            {m.seo_common_validate_viewer()} →
          </Link>
        </Container>
      </section>
    </main>
  );
}

export function seoGuideJsonLd(kind: Kind, url: string) {
  const page = localizedPage(kind);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: page.kicker,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web browser',
      url,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: page.description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: page.title,
      step: page.steps.map(([number, title, text]) => ({
        '@type': 'HowToStep',
        position: Number(number),
        name: title,
        text,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ];
}
