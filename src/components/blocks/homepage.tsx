import { SkinWorkspace } from '@/components/skin/skin-workspace';
import { m } from '@/locale/paraglide/messages';

const faqs = [
  [m.skin_faq_privacy_question, m.skin_faq_privacy_answer],
  [m.skin_faq_formats_question, m.skin_faq_formats_answer],
  [m.skin_faq_mobile_question, m.skin_faq_mobile_answer],
  [m.skin_faq_free_question, m.skin_faq_free_answer],
];

export function HomePage() {
  return (
    <div className="skin-site">
      <section className="skin-hero">
        <div className="skin-container skin-hero-grid">
          <div className="skin-hero-copy">
            <div className="skin-kicker">
              <span className="skin-pulse" /> {m.skin_hero_kicker()}
            </div>
            <h1>{m.skin_hero_title()}</h1>
            <p>{m.skin_hero_text()}</p>
            <div className="skin-hero-meta">
              <span>64x64 / 128x128</span>
              <span>Local conversion</span>
              <span>No signup</span>
            </div>
          </div>
          <div
            className="skin-hero-proof"
            role="img"
            aria-label="Photo to Minecraft skin preview"
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
        <SkinWorkspace />
        <section className="skin-section" aria-labelledby="examples-title">
          <div className="skin-section-heading">
            <span>01</span>
            <h2 id="examples-title">{m.skin_examples_title()}</h2>
          </div>
          <div className="skin-example-grid">
            <button
              type="button"
              className="skin-example-card"
              onClick={() =>
                document
                  .querySelector<HTMLButtonElement>('.skin-example-button')
                  ?.click()
              }
            >
              <span className="skin-example-portrait" />
              <strong>Portrait</strong>
              <small>Photo to skin</small>
            </button>
            <button
              type="button"
              className="skin-example-card"
              onClick={() =>
                document
                  .querySelector<HTMLButtonElement>('.skin-example-button')
                  ?.click()
              }
            >
              <span className="skin-example-character" />
              <strong>Character art</strong>
              <small>Map a favorite hero</small>
            </button>
            <button
              type="button"
              className="skin-example-card"
              onClick={() =>
                document
                  .querySelector<HTMLButtonElement>('.skin-example-button')
                  ?.click()
              }
            >
              <span className="skin-example-pixels" />
              <strong>Pixel art</strong>
              <small>Keep hard edges</small>
            </button>
          </div>
        </section>
        <section className="skin-section" aria-labelledby="compatibility-title">
          <div className="skin-section-heading">
            <span>02</span>
            <h2 id="compatibility-title">{m.skin_compat_title()}</h2>
          </div>
          <div className="skin-compat-grid">
            <article>
              <span className="skin-compat-size">64</span>
              <div>
                <h3>{m.skin_java()}</h3>
                <p>{m.skin_compat_java_body()}</p>
              </div>
            </article>
            <article>
              <span className="skin-compat-size">128</span>
              <div>
                <h3>{m.skin_bedrock()}</h3>
                <p>{m.skin_compat_bedrock_body()}</p>
              </div>
            </article>
          </div>
        </section>
        <section className="skin-section skin-faq" aria-labelledby="faq-title">
          <div className="skin-section-heading">
            <span>03</span>
            <h2 id="faq-title">{m.skin_faq_title()}</h2>
          </div>
          {faqs.map(([question, answer]) => (
            <details key={question()}>
              <summary>
                {question()}
                <span>+</span>
              </summary>
              <p>{answer()}</p>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
}
