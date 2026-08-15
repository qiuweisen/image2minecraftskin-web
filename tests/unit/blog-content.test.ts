import { describe, expect, test } from 'vitest';

import { splitBlogContentForPracticeCard } from '@/lib/blog-content';

describe('splitBlogContentForPracticeCard', () => {
  test('places the card between the first and second H2 sections', () => {
    const result = splitBlogContentForPracticeCard(
      '<p>Intro</p><h2 id="one">One</h2><p>First section</p><h2 id="two">Two</h2><p>Second section</p>'
    );

    expect(result.placement).toBe('after-first-h2-section');
    expect(result.before).toContain('<p>First section</p>');
    expect(result.before).not.toContain('id="two"');
    expect(result.after).toBe('<h2 id="two">Two</h2><p>Second section</p>');
  });

  test('falls back to the end when a second H2 does not exist', () => {
    const result = splitBlogContentForPracticeCard(
      '<h2 id="only">Only section</h2><p>Article body</p>'
    );

    expect(result.placement).toBe('end');
    expect(result.before).toBe(
      '<h2 id="only">Only section</h2><p>Article body</p>'
    );
    expect(result.after).toBe('');
  });
});
