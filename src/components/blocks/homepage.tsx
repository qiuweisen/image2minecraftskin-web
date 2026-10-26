import { SkinWorkspace } from '@/components/skin/skin-workspace';
import Container from '@/components/layout/container';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from '@tanstack/react-router';
import { getHomepageConfig } from '@/config/homepage-config';
import { trackSkinEvent } from '@/lib/analytics-events';
import { m } from '@/locale/paraglide/messages';

function SkinStill({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`skin-still ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function WorldChrome({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`world-stage ${className}`}>
      <div className="stars" aria-hidden="true" />
      <div className="moon" aria-hidden="true" />
      <div className="tree-line" aria-hidden="true" />
      <div className="ground" aria-hidden="true">
        <div className="grass" />
        <div className="dirt" />
      </div>
      {children}
    </div>
  );
}

function HeroProof() {
  return (
    <WorldChrome className="hero-proof-v51">
      <div className="proof-flow">
        <figure className="polaroid">
          <span className="sticky">Source</span>
          <div className="photo">
            <img src="/examples/v51/proof-ivy.jpg" alt="Ivy portrait" />
          </div>
          <figcaption className="caption">Photo · Ivy</figcaption>
        </figure>
        <span className="proof-arrow">Local →</span>
        <SkinStill
          src="/examples/v51/proof-ivy-local.png"
          alt="Ivy local skin preview"
          className="hero-skin-still"
        />
        <span className="badge-float real">On-device</span>
      </div>
    </WorldChrome>
  );
}

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
    <section id={id} className="skin-section-v51">
      <Container>
        <ScrollReveal>
          <div className="section-heading-v51">
            <span>{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </ScrollReveal>
        {children}
      </Container>
    </section>
  );
}

function GalleryRow({ cat = false }: { cat?: boolean }) {
  const photo = cat
    ? '/examples/v51/gallery-pet-photo.jpg'
    : '/examples/v51/gallery-person-photo.jpg';
  const local = cat
    ? '/examples/v51/gallery-pet-local.png'
    : '/examples/v51/gallery-person-local.png';
  const ai = cat
    ? '/examples/v51/gallery-pet-ai.png'
    : '/examples/v51/gallery-person-ai.png';
  const name = cat ? 'Mango' : 'Hoodie';
  return (
    <div className="case-row">
      <div className="case-col">
        <h3>
          Photo <span className="badge">{cat ? 'Pet' : 'Source'}</span>
        </h3>
        <div className="case-stage">
          <div className="gstrip">
            <div className="grass" />
            <div className="dirt" />
          </div>
          <figure
            className={`polaroid gallery-polaroid ${cat ? 'cat-photo' : ''}`}
          >
            <div className="photo">
              <img src={photo} alt={`${name} source`} loading="lazy" />
            </div>
            <figcaption className="caption">{name}</figcaption>
          </figure>
        </div>
      </div>
      <span className="case-arrow" aria-hidden="true">
        →
      </span>
      <div className="case-col">
        <h3>
          Free local <span className="badge mint">Real result</span>
        </h3>
        <div className="case-stage">
          <div className="gstrip">
            <div className="grass" />
            <div className="dirt" />
          </div>
          <SkinStill
            src={local}
            alt={`${name} free local skin`}
            className="gallery-skin-still"
          />
        </div>
        <p className="case-meta">On-device · no account</p>
      </div>
      <span className="case-arrow" aria-hidden="true">
        →
      </span>
      <div className="case-col">
        <h3>
          AI finish <span className="badge mint">Real KIE</span>
        </h3>
        <div className="case-stage">
          <div className="gstrip">
            <div className="grass" />
            <div className="dirt" />
          </div>
          <SkinStill
            src={ai}
            alt={`${name} AI skin`}
            className="gallery-skin-still ai"
          />
        </div>
        <p className="case-meta">Optional · 1 credit</p>
      </div>
    </div>
  );
}

function HomePage() {
  const config = getHomepageConfig();
  const { landing } = config;
  return (
    <div className="skin-site skin-page">
      <section className="skin-hero-v51">
        <Container>
          <div className="hero-v51-grid">
            <div className="hero-copy-v51">
              <span className="eyebrow">PHOTO → SKIN</span>
              <h1>
                YOUR PHOTO,
                <br />
                IN BLOCKS.
              </h1>
              <p className="sub">
                Free local · no account · optional AI finish. Wear it in Java
                &amp; Bedrock.
              </p>
              <div className="trust">
                <span>Local</span>
                <span>{m.skin_meta_signup()}</span>
                <span>Java &amp; Bedrock</span>
              </div>
              <div className="hero-ctas">
                <Link to="/" hash="generator" className="btn-coral">
                  Create free skin
                </Link>
                <Link to="/" hash="how-to-use" className="btn-ghost">
                  How it works
                </Link>
              </div>
            </div>
            <HeroProof />
          </div>
        </Container>
      </section>

      <section id="generator" className="tool-band-v51">
        <Container>
          <div className="section-eye-v51">SKIN PREVIEW · ON THIS PAGE</div>
          <SkinWorkspace />
        </Container>
      </section>

      <section id="gallery" className="gallery-wrap-v51">
        <Container>
          <div className="section-eye-v51">PREVIEW GALLERY</div>
          <h2>PHOTO → FREE LOCAL → AI</h2>
          <p className="lead">
            Real Photo → Local → AI examples. Free local first — AI only if you
            want more likeness.
          </p>
          <GalleryRow />
          <GalleryRow cat />
        </Container>
      </section>

      <TextSection
        id="what-is"
        eyebrow={landing.whatIs.eyebrow}
        title={landing.whatIs.title}
        description={landing.whatIs.description}
      >
        <ScrollReveal delay={100} className="section-content-v51">
          <div className="split-copy-v51">
            <div>
              <p>{m.landing_what_paragraph1()}</p>
              <p>{m.landing_what_paragraph2()}</p>
            </div>
            <dl>
              <div>
                <dt>{m.landing_input()}</dt>
                <dd>PNG / JPG / WEBP</dd>
              </div>
              <div>
                <dt>{m.landing_preview()}</dt>
                <dd>2D + 3D</dd>
              </div>
              <div>
                <dt>{m.landing_export()}</dt>
                <dd>64×64 / 128×128</dd>
              </div>
            </dl>
          </div>
        </ScrollReveal>
      </TextSection>

      <TextSection
        id="features"
        eyebrow={landing.featuresHeading.eyebrow}
        title={landing.featuresHeading.title}
        description={landing.featuresHeading.description}
      >
        <div className="feature-grid-v51">
          {landing.features.map(({ title, description }, index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </TextSection>

      <TextSection
        id="how-to-use"
        eyebrow={landing.howToUse.eyebrow}
        title={landing.howToUse.title}
        description={landing.howToUse.description}
      >
        <div className="steps-grid-v51">
          {landing.howToUse.steps.map(({ number, title, description }) => (
            <article key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </TextSection>

      <TextSection
        id="compatibility"
        eyebrow={landing.compatibilityHeading.eyebrow}
        title={config.sectionTitles.compatibility}
        description={landing.compatibilityHeading.description}
      >
        <div className="compat-grid-v51">
          {config.compatibility.map((item) => (
            <article key={item.size}>
              <strong>{item.size}</strong>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </TextSection>

      <section className="handoff-v51">
        <Container>
          <div>
            <span className="section-eye-v51">
              {landing.viewerHandoff.eyebrow}
            </span>
            <h2>{landing.viewerHandoff.title}</h2>
            <p>{landing.viewerHandoff.description}</p>
          </div>
          <Link
            to="/minecraft-skin-viewer"
            hash="skin-viewer"
            onClick={() =>
              trackSkinEvent({
                name: 'skin_viewer_handoff_clicked',
                payload: { location: 'generator_supporting_section' },
              })
            }
            className="btn-ghost"
          >
            {landing.viewerHandoff.button}
          </Link>
        </Container>
      </section>

      <section className="trust-v51">
        <Container>
          <div>
            <span className="section-eye-v51">{landing.trust.eyebrow}</span>
            <h2>{landing.trust.title}</h2>
            <p>{landing.trust.description}</p>
          </div>
          <div className="trust-stats">
            <div>
              <strong>Local</strong>
              <span>{m.landing_trust_processing()}</span>
            </div>
            <div>
              <strong>2</strong>
              <span>{m.landing_trust_formats()}</span>
            </div>
            <div>
              <strong>0</strong>
              <span>{m.landing_trust_signup()}</span>
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
        <Accordion className="faq-v51">
          {config.faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TextSection>

      <section className="final-cta-v51">
        <Container>
          <span className="section-eye-v51">{landing.cta.eyebrow}</span>
          <h2>{landing.cta.title}</h2>
          <Link to="/" hash="generator" className="btn-coral">
            {landing.cta.button}
          </Link>
        </Container>
      </section>
    </div>
  );
}

export { HomePage };
