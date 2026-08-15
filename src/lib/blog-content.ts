export type BlogContentSplit = {
  before: string;
  after: string;
  placement: 'after-first-h2-section' | 'end';
};

const H2_PATTERN = /<h2\b[^>]*>[\s\S]*?<\/h2>/gi;

/**
 * Split rendered article HTML at the end of its first H2 section.
 *
 * The rendered markdown has already been sanitized/serialized by the blog
 * pipeline, so splitting at the next H2 keeps tables, lists, and code blocks
 * intact. Articles without a second H2 fall back to an end-of-article CTA.
 */
export function splitBlogContentForPracticeCard(
  contentHtml: string
): BlogContentSplit {
  const matches = [...contentHtml.matchAll(H2_PATTERN)];
  const secondH2Index = matches[1]?.index;

  if (secondH2Index !== undefined) {
    return {
      before: contentHtml.slice(0, secondH2Index).trim(),
      after: contentHtml.slice(secondH2Index).trim(),
      placement: 'after-first-h2-section',
    };
  }

  return {
    before: contentHtml.trim(),
    after: '',
    placement: 'end',
  };
}
