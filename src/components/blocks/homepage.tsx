import { SkinWorkspace } from '@/components/skin/skin-workspace';
import {
  getHomepageConfig,
  type HomepageConfig,
  type HomepageSectionId,
} from '@/config/homepage-config';

function ExamplesSection({ config }: { config: HomepageConfig }) {
  return (
    <section className="skin-section" aria-labelledby="examples-title">
      <div className="skin-section-heading">
        <span>01</span>
        <h2 id="examples-title">{config.sectionTitles.examples}</h2>
      </div>
      <div className="skin-example-grid">
        {config.examples.map((example) => (
          <button
            key={example.title}
            type="button"
            className="skin-example-card"
            onClick={() =>
              document
                .querySelector<HTMLButtonElement>('.skin-example-button')
                ?.click()
            }
          >
            <span className={example.visualClassName} />
            <strong>{example.title}</strong>
            <small>{example.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function CompatibilitySection({ config }: { config: HomepageConfig }) {
  return (
    <section className="skin-section" aria-labelledby="compatibility-title">
      <div className="skin-section-heading">
        <span>02</span>
        <h2 id="compatibility-title">{config.sectionTitles.compatibility}</h2>
      </div>
      <div className="skin-compat-grid">
        {config.compatibility.map((item) => (
          <article key={item.size}>
            <span className="skin-compat-size">{item.size}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ config }: { config: HomepageConfig }) {
  return (
    <section className="skin-section skin-faq" aria-labelledby="faq-title">
      <div className="skin-section-heading">
        <span>03</span>
        <h2 id="faq-title">{config.sectionTitles.faq}</h2>
      </div>
      {config.faqs.map((faq) => (
        <details key={faq.question}>
          <summary>
            {faq.question}
            <span>+</span>
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </section>
  );
}

function renderSection(id: HomepageSectionId, config: HomepageConfig) {
  switch (id) {
    case 'generator':
      return <SkinWorkspace key={id} />;
    case 'examples':
      return <ExamplesSection key={id} config={config} />;
    case 'compatibility':
      return <CompatibilitySection key={id} config={config} />;
    case 'faq':
      return <FaqSection key={id} config={config} />;
  }
}

export function HomePage() {
  const config = getHomepageConfig();

  return (
    <div className="skin-site">
      <section className="skin-hero">
        <div className="skin-container skin-hero-grid">
          <div className="skin-hero-copy">
            <div className="skin-kicker">
              <span className="skin-pulse" /> {config.hero.kicker}
            </div>
            <h1>{config.hero.title}</h1>
            <p>{config.hero.text}</p>
            <div className="skin-hero-meta">
              {config.hero.facts.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </div>
          </div>
          <div
            className="skin-hero-proof"
            role="img"
            aria-label={config.hero.proofLabel}
          >
            <div className="skin-proof-source">
              <div className="skin-proof-avatar" />
            </div>
            <div className="skin-proof-arrow">→</div>
            <div className="skin-proof-result">
              <div className="skin-proof-character">
                <i />
                <b />
                <em />
              </div>
            </div>
          </div>
        </div>
      </section>
      <main className="skin-container skin-main">
        {config.sections
          .filter((section) => section.enabled)
          .map((section) => renderSection(section.id, config))}
      </main>
    </div>
  );
}
