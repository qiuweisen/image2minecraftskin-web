import { describe, expect, it } from 'vitest';
import { getFooterLinks } from '@/config/footer-config';
import { getHomepageConfig } from '@/config/homepage-config';
import { getNavbarLinks } from '@/config/navbar-config';
import { getSkinToolConfig } from '@/config/skin-tool-config';
import { websiteConfig } from '@/config/website';

describe('site configuration', () => {
  it('defines ordered and unique homepage sections', () => {
    const config = getHomepageConfig();
    const ids = config.sections.map((section) => section.id);

    expect(ids).toEqual(['generator', 'examples', 'compatibility', 'faq']);
    expect(new Set(ids).size).toBe(ids.length);
    expect(config.hero.facts).toHaveLength(3);
    expect(config.faqs.every((faq) => faq.question && faq.answer)).toBe(true);
  });

  it('defines valid local converter limits and defaults', () => {
    const config = getSkinToolConfig();

    expect(config.acceptedTypes).toEqual([
      'image/png',
      'image/jpeg',
      'image/webp',
    ]);
    expect(config.maxFileSizeBytes).toBe(10 * 1024 * 1024);
    expect(config.formats.map((format) => format.size)).toEqual([64, 128]);
    expect(config.formats.map((format) => format.value)).toContain(
      config.defaultFormat
    );
    expect(config.models.map((model) => model.value)).toContain(
      config.defaultModel
    );
  });

  it('resolves navigation and footer content from configuration', () => {
    const navbar = getNavbarLinks();
    const footer = getFooterLinks();

    expect(navbar.every((item) => item.title.length > 0)).toBe(true);
    expect(
      footer.every(
        (section) =>
          section.title.length > 0 &&
          section.items?.every((item) => item.title.length > 0)
      )
    ).toBe(true);
    expect(websiteConfig.footer?.tagline).toBeTruthy();
  });

  it('keeps product copy out of reusable components', () => {
    const files = [
      'src/components/blocks/homepage.tsx',
      'src/components/skin/skin-workspace.tsx',
      'src/components/layout/footer.tsx',
    ];
    const forbiddenCopy = [
      'Local conversion',
      'No signup',
      'Portrait',
      'Character art',
      'Uploaded source',
      'Turn images into ready-to-use',
    ];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      for (const copy of forbiddenCopy) expect(source).not.toContain(copy);
    }
  });
});
import { readFileSync } from 'node:fs';
