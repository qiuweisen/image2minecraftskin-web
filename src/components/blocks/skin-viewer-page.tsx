import { IconArrowRight, IconCheck, IconEye } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { HeaderSection } from '@/components/shared/header-section';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { SkinViewerWorkspace } from '@/components/skin/skin-viewer-workspace';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { skinViewerConfig } from '@/config/skin-viewer-config';
import { cn } from '@/lib/utils';

function ViewerSection({
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
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-b border-[#21464a] bg-[#0b1011] px-4 py-20 text-[#f1f3ed] md:py-28"
    >
      <Container className="px-2">
        <HeaderSection
          title={eyebrow}
          subtitle={title}
          description={description}
          className="items-start text-left"
          titleClassName="font-mono text-xs text-[#36d8d4]"
          subtitleClassName="max-w-3xl text-3xl font-semibold leading-tight text-[#f1f3ed] sm:text-5xl"
          descriptionClassName="max-w-2xl text-base leading-7 text-[#8d9a9a] sm:text-lg"
        />
        {children}
      </Container>
    </section>
  );
}

export function SkinViewerPage() {
  const config = skinViewerConfig;
  return (
    <div className="bg-[#0b1011] text-[#f1f3ed]">
      <section className="border-b border-[#21464a] px-4 pb-20 pt-16 md:pb-28 md:pt-24">
        <Container className="px-2">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="flex items-center gap-2 font-mono text-xs uppercase text-[#36d8d4]">
                <IconEye className="size-4" /> {config.hero.kicker}
              </p>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-6xl lg:text-[4.5rem] lg:leading-[1.03]">
                {config.hero.title}
              </h1>
            </div>
            <div className="border-l border-[#2a7378] pl-6 sm:pl-8">
              <p className="max-w-2xl text-lg leading-8 text-[#8d9a9a]">
                {config.hero.description}
              </p>
              <a
                href="#skin-viewer"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-7 min-h-11 rounded-sm px-5'
                )}
              >
                Preview a skin <IconArrowRight />
              </a>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-[#8d9a9a]">
                {config.hero.facts.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        id="skin-viewer"
        className="border-b border-[#21464a] px-4 py-8 md:py-12"
      >
        <Container className="px-0 sm:px-2">
          <SkinViewerWorkspace />
        </Container>
      </section>

      <ViewerSection {...config.explanation}>
        <ScrollReveal className="mt-12">
          <div className="grid border-y border-[#21464a] md:grid-cols-3">
            {config.steps.map((step, index) => (
              <article
                key={step.number}
                className="min-h-60 border-b border-[#21464a] p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-9"
              >
                <span className="font-mono text-xs text-[#36d8d4]">
                  {step.number}
                </span>
                <h2 className="mt-12 text-xl font-semibold">{step.title}</h2>
                <p className="mt-3 leading-7 text-[#8d9a9a]">
                  {step.description}
                </p>
                {index < config.steps.length - 1 && (
                  <IconArrowRight className="mt-8 size-5 text-[#2a7378] md:hidden" />
                )}
              </article>
            ))}
          </div>
        </ScrollReveal>
      </ViewerSection>

      <ViewerSection
        id="formats"
        eyebrow="Supported textures"
        title="Java and Bedrock skin formats"
        description="The viewer validates the image before rendering it so ordinary photos and unsupported textures do not produce a misleading model."
      >
        <ScrollReveal className="mt-12">
          <div className="grid border border-[#21464a] md:grid-cols-2">
            {config.formats.map((format) => (
              <article
                key={format.size}
                className="flex min-h-56 items-center gap-7 border-b border-[#21464a] bg-[#11191b] p-8 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-10"
              >
                <span className="font-mono text-5xl font-semibold text-[#a8dd45]">
                  {format.size}
                </span>
                <div>
                  <h2 className="font-semibold">{format.title}</h2>
                  <p className="mt-2 leading-7 text-[#8d9a9a]">
                    {format.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </ViewerSection>

      <ViewerSection
        id="viewer-faq"
        eyebrow="FAQ"
        title="Before you preview a skin"
        description="Answers about supported textures, privacy, arm models, and the difference between viewing and generating."
      >
        <ScrollReveal className="mt-10">
          <Accordion className="w-full max-w-4xl border-y border-[#21464a]">
            {config.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`viewer-faq-${index}`}>
                <AccordionTrigger className="py-5 text-left text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 leading-7 text-[#8d9a9a]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </ViewerSection>

      <section className="border-b border-[#21464a] px-4 py-16 md:py-24">
        <Container className="px-2">
          <div className="grid gap-8 border border-[#21464a] bg-[#11191b] px-6 py-12 sm:px-10 md:grid-cols-[1fr_auto] md:items-center md:py-16">
            <div>
              <p className="font-mono text-xs uppercase text-[#36d8d4]">
                {config.cta.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                {config.cta.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#8d9a9a]">
                {config.cta.description}
              </p>
            </div>
            <Link
              to="/"
              hash="generator"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'min-h-11 rounded-sm px-5'
              )}
            >
              <IconCheck /> {config.cta.button}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
