import { SkinWorkspace } from '@/components/skin/skin-workspace';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from '@tanstack/react-router';
import { getHomepageConfig } from '@/config/homepage-config';
import { cn } from '@/lib/utils';

function TextSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-b border-[#21464a] bg-[#0b1011] px-4 py-20 text-[#f1f3ed] md:py-28"
    >
      <Container className="px-2">
        <ScrollReveal>
          <HeaderSection
            title={eyebrow}
            subtitle={title}
            description={description}
            className="items-start text-left"
            titleClassName="font-mono text-xs text-primary"
            subtitleClassName="max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl"
            descriptionClassName="max-w-2xl text-base leading-7 text-[#8d9a9a] sm:text-lg"
          />
        </ScrollReveal>
        {children}
      </Container>
    </section>
  );
}

function HomePage() {
  const config = getHomepageConfig();
  const { landing } = config;
  return (
    <div className="bg-[#0b1011] text-[#f1f3ed]">
      <section className="overflow-hidden border-b border-[#21464a] bg-[#0b1011] px-4 pb-24 pt-14 text-[#f1f3ed] md:pb-32 md:pt-20">
        <Container className="px-2">
          <div className="grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                / {config.hero.kicker}
              </p>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-[4.5rem] lg:leading-[1.03]">
                {config.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#8d9a9a]">
                {config.hero.text}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  hash="generator"
                  className={buttonVariants({ size: 'lg' })}
                >
                  Create a skin
                </Link>
                <Link
                  to="/"
                  hash="what-is"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'outline' }),
                    'border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100'
                  )}
                >
                  Learn how it works
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-[#8d9a9a]">
                {config.hero.facts.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </div>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden border border-[#2a7378] bg-[#11191b] shadow-2xl shadow-black/40">
              <img
                src="/og-image2minecraftskin.png"
                alt={config.hero.proofLabel}
                className="size-full object-cover"
                width={1792}
                height={1024}
                fetchPriority="high"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-[#21464a] bg-[#0b1011]/90 px-4 py-3 font-mono text-[10px] uppercase text-[#8d9a9a]">
                <span>Source image</span>
                <span className="text-cyan-300">Skin ready</span>
                <span>PNG texture</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        id="generator"
        className="relative -mt-14 border-b border-[#21464a] bg-[#0b1011] px-4 pb-16 md:-mt-20 md:pb-24"
      >
        <Container className="px-0 sm:px-2">
          <SkinWorkspace />
        </Container>
      </section>

      <TextSection id="what-is" {...landing.whatIs}>
        <ScrollReveal delay={100} className="mt-12">
          <div className="grid border-y lg:grid-cols-[1.1fr_0.9fr]">
            <div className="py-8 pr-0 text-lg leading-8 text-[#8d9a9a] lg:border-r lg:border-[#21464a] lg:pr-12">
              <p>
                Start with a portrait, character illustration, or pixel artwork.
                The generator maps the image into a skin texture you can inspect
                before saving.
              </p>
              <p className="mt-5">
                It is designed for a fast first result rather than a complex
                pixel editor, so the conversion stays clear and approachable.
              </p>
            </div>
            <dl className="divide-y divide-[#21464a] py-2 lg:pl-12">
              <div className="flex items-baseline justify-between gap-6 py-5">
                <dt className="font-medium">Input</dt>
                <dd className="font-mono text-sm text-[#8d9a9a]">
                  PNG / JPG / WEBP
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-5">
                <dt className="font-medium">Preview</dt>
                <dd className="font-mono text-sm text-[#8d9a9a]">2D + 3D</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-5">
                <dt className="font-medium">Export</dt>
                <dd className="font-mono text-sm text-[#8d9a9a]">
                  64x64 / 128x128
                </dd>
              </div>
            </dl>
          </div>
        </ScrollReveal>
      </TextSection>

      <TextSection id="features" {...landing.featuresHeading}>
        <ScrollReveal delay={100} className="mt-10">
          <div className="grid gap-px overflow-hidden border border-[#21464a] bg-[#21464a] md:grid-cols-2">
            {landing.features.map(({ title, description }, index) => (
              <Card
                key={title}
                className="min-h-56 rounded-none border-0 bg-[#11191b] text-[#f1f3ed] ring-0"
              >
                <CardHeader className="gap-6 p-7 sm:p-9">
                  <span className="font-mono text-xs text-primary">
                    0{index + 1}
                  </span>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="max-w-md px-7 pb-8 text-base leading-7 text-[#8d9a9a] sm:px-9">
                  {description}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </TextSection>

      <TextSection id="how-to-use" {...landing.howToUse}>
        <ScrollReveal delay={100} className="mt-10">
          <div className="grid border border-[#21464a] md:grid-cols-2 xl:grid-cols-4">
            {landing.howToUse.steps.map(({ number, title, description }) => (
              <div
                key={number}
                className="min-h-64 border-b p-7 last:border-b-0 md:nth-[odd]:border-r md:nth-[3]:border-b-0 xl:border-b-0 xl:border-r xl:last:border-r-0"
              >
                <span className="grid size-10 place-items-center border font-mono text-sm text-primary">
                  {number}
                </span>
                <h3 className="mt-12 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#8d9a9a]">{description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </TextSection>

      <TextSection
        id="compatibility"
        eyebrow={landing.compatibilityHeading.eyebrow}
        title={config.sectionTitles.compatibility}
        description={landing.compatibilityHeading.description}
      >
        <ScrollReveal delay={100} className="mt-10">
          <div className="grid overflow-hidden border border-[#21464a] md:grid-cols-2">
            {config.compatibility.map((item) => (
              <Card
                key={item.size}
                className="rounded-none border-0 bg-[#11191b] py-0 text-[#f1f3ed] ring-0 first:border-b first:border-[#21464a] md:first:border-b-0 md:first:border-r md:first:border-r-[#21464a]"
              >
                <CardContent className="flex min-h-56 items-center gap-7 p-8 sm:p-10">
                  <span className="font-mono text-5xl font-semibold text-primary">
                    {item.size}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-[#8d9a9a]">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </TextSection>

      <section
        id="trust"
        className="border-y border-[#21464a] bg-[#11191b] px-4 py-16 text-[#f1f3ed] md:py-20"
      >
        <Container className="grid gap-8 px-2 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase text-cyan-300">
              / {landing.trust.eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
              {landing.trust.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[#8d9a9a]">
              {landing.trust.description}
            </p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#21464a] border border-[#21464a]">
            <div className="px-5 py-4 text-center">
              <strong className="block font-mono text-cyan-300">LOCAL</strong>
              <span className="text-xs text-[#8d9a9a]">processing</span>
            </div>
            <div className="px-5 py-4 text-center">
              <strong className="block font-mono text-cyan-300">2</strong>
              <span className="text-xs text-[#8d9a9a]">formats</span>
            </div>
            <div className="px-5 py-4 text-center">
              <strong className="block font-mono text-cyan-300">0</strong>
              <span className="text-xs text-[#8d9a9a]">signup</span>
            </div>
          </div>
        </Container>
      </section>

      <TextSection
        id="faqs"
        eyebrow={landing.faqHeading.eyebrow}
        title={config.sectionTitles.faq}
        description={landing.faqHeading.description}
      >
        <ScrollReveal delay={100} className="mt-10">
          <Accordion className="w-full max-w-4xl border-y border-[#21464a]">
            {config.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-5 text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[#8d9a9a]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </TextSection>

      <section className="border-t border-[#21464a] px-4 py-16 md:py-24">
        <Container className="px-2">
          <div className="border border-[#21464a] bg-[#11191b] px-6 py-14 text-center text-[#f1f3ed] sm:px-12 sm:py-20">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              / {landing.cta.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              {landing.cta.title}
            </h2>
            <Link
              to="/"
              hash="generator"
              className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}
            >
              {landing.cta.button}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

export { HomePage };
