import Container from '@/components/layout/container';

const examples = [
  { name: 'person', label: 'Person portrait' },
  { name: 'pet', label: 'Pet companion' },
  { name: 'outfit', label: 'Full outfit' },
];

export function AiEffectGallery() {
  return (
    <section
      className="border-b border-[#21464a] bg-[#0b1011] px-4 py-14 text-[#f1f3ed] md:py-20"
      aria-labelledby="effect-gallery-title"
    >
      <Container className="px-2">
        <p className="font-mono text-xs uppercase text-cyan-300">
          / EFFECT GALLERY
        </p>
        <h2
          id="effect-gallery-title"
          className="mt-3 text-3xl font-semibold sm:text-4xl"
        >
          One photo, three ways to play
        </h2>
        <p className="mt-3 max-w-2xl text-[#8d9a9a]">
          Compare the free browser result with an optional AI pass. Every output
          is a real 64×64 playable skin.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {examples.map((example) => (
            <figure
              key={example.name}
              className="border border-[#21464a] bg-[#11191b] p-3"
            >
              <figcaption className="mb-3 font-mono text-xs uppercase text-cyan-200">
                {example.label}
              </figcaption>
              <div className="grid grid-cols-3 gap-2">
                {(['photo', 'local', 'ai'] as const).map((kind) => (
                  <div key={kind} className="min-w-0">
                    <div className="aspect-square overflow-hidden border border-[#2a7378] bg-[#0b1011]">
                      <img
                        src={`/content/ai-examples/${example.name}/${kind}.svg`}
                        alt={`${example.label} ${kind}`}
                        className="size-full"
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-2 block font-mono text-[10px] uppercase text-[#8d9a9a]">
                      {kind === 'ai'
                        ? 'AI'
                        : kind === 'local'
                          ? 'Local free'
                          : 'Photo'}
                    </span>
                  </div>
                ))}
              </div>
            </figure>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-[#8d9a9a]">
          No account for Local · AI only after you click · Failures refund
          credit
        </p>
      </Container>
    </section>
  );
}
