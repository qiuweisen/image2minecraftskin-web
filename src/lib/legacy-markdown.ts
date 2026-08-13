// Client-safe markdown to HTML converter (extracted from blog.ts)
// Supports tables, code blocks, headings, lists, links, etc.

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(s: string): string {
  // inline code
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`);
  // bold **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic *text*
  s = s.replace(/(^|\s)\*([^*]+)\*(?=\s|$)/g, '$1<em>$2</em>');
  // links [text](url)
  s = s.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, text: string, url: string) => {
      const isExternal = /^(?:https?:)?\/\//.test(url);
      const isAffiliateRedirect =
        url.startsWith('/go/') ||
        url.includes('ninjatraderdomesticvendor.sjv.io/');
      const attrs = isAffiliateRedirect
        ? ' target="_blank" rel="sponsored nofollow noopener noreferrer"'
        : isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
      return `<a class="underline text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" href="${url}"${attrs}>${text}</a>`;
    }
  );
  return s;
}

function parseTableRow(row: string): string[] {
  return row
    .split('|')
    .map((cell) => cell.trim())
    .filter(
      (_, idx, arr) =>
        (idx > 0 && idx < arr.length - 1) || (arr.length === 2 && idx === 1)
    );
}

export function markdownToHtml(md: string): string {
  // Remove frontmatter if present
  let content = md;
  if (md.startsWith('---')) {
    const end = md.indexOf('\n---', 3);
    if (end !== -1) {
      content = md.slice(end + 4).replace(/^\s+/, '');
    }
  }

  const lines = content.split(/\r?\n/);
  const html: string[] = [];
  let inCode = false;
  let inTable = false;
  let tableRows: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  let listItems: string[] = [];
  let buf: string[] = [];

  function flushParagraph() {
    if (buf.length) {
      const text = buf.join(' ').trim();
      if (text) html.push(`<p>${renderInline(text)}</p>`);
      buf = [];
    }
  }

  function flushList() {
    if (listItems.length) {
      const items = listItems
        .map((item) => `<li>${renderInline(item)}</li>`)
        .join('\n');
      html.push(`<${listType}>\n${items}\n</${listType}>`);
      listItems = [];
      inList = false;
    }
  }

  function flushTable() {
    if (tableRows.length < 2) {
      tableRows = [];
      inTable = false;
      return;
    }
    const headerRow = tableRows[0];
    const separatorRow = tableRows[1];
    if (!/^[\s|:-]+$/.test(separatorRow)) {
      tableRows.forEach((row) => {
        html.push(`<p>${renderInline(row)}</p>`);
      });
      tableRows = [];
      inTable = false;
      return;
    }
    const headers = parseTableRow(headerRow);
    const dataRows = tableRows.slice(2);

    let tableHtml =
      '<div class="overflow-x-auto my-3 pb-2"><table class="min-w-full border-collapse text-sm mb-1">';
    tableHtml += '<thead><tr>';
    headers.forEach((h) => {
      tableHtml += `<th class="border border-slate-300 dark:border-[#2a2e39] bg-slate-100 dark:bg-[#1e222d] px-3 py-2 text-left font-semibold whitespace-nowrap">${renderInline(h)}</th>`;
    });
    tableHtml += '</tr></thead>';
    tableHtml += '<tbody>';
    dataRows.forEach((row) => {
      const cells = parseTableRow(row);
      tableHtml += '<tr>';
      cells.forEach((cell) => {
        tableHtml += `<td class="border border-slate-300 dark:border-[#2a2e39] bg-white dark:bg-[#131722] px-3 py-2 whitespace-nowrap">${renderInline(cell)}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    html.push(tableHtml);
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCode) {
        html.push(
          `<pre class="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto my-4 text-xs"><code>${escapeHtml(buf.join('\n'))}</code></pre>`
        );
        buf = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        if (inTable) flushTable();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      buf.push(line);
      continue;
    }

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushParagraph();
      flushList();
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blockquotes
    if (line.startsWith('>')) {
      flushParagraph();
      flushList();
      const quoteText = line.replace(/^>\s*/, '');
      html.push(
        `<blockquote class="border-l-4 border-indigo-500 pl-4 my-4 italic text-slate-600 dark:text-slate-400">${renderInline(quoteText)}</blockquote>`
      );
      continue;
    }

    // ATX headings
    const hx = line.match(/^(#{1,6})\s*(.+)$/);
    if (hx) {
      const level = Math.min(6, hx[1].length);
      const text = hx[2].trim();
      if (text) {
        flushParagraph();
        flushList();
        const sizes: Record<number, string> = {
          1: 'text-2xl',
          2: 'text-xl',
          3: 'text-lg',
          4: 'text-base',
          5: 'text-sm',
          6: 'text-sm',
        };
        html.push(
          `<h${level} class="${sizes[level]} font-bold mt-4 mb-2">${renderInline(text)}</h${level}>`
        );
        continue;
      }
    }

    // Unordered list items
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list items
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(olMatch[1]);
      continue;
    }

    if (inList && line.trim() && !ulMatch && !olMatch) {
      flushList();
    }

    // Horizontal rule
    if (/^[-*_]{3,}\s*$/.test(line.trim())) {
      flushParagraph();
      flushList();
      html.push('<hr class="my-6 border-slate-300 dark:border-slate-600">');
      continue;
    }

    // blank line
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    buf.push(line.trim());
  }
  flushParagraph();
  flushList();
  if (inTable) flushTable();
  return html.join('\n');
}
