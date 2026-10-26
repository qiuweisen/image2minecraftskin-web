import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

const component = readFileSync(
  resolve(process.cwd(), 'src/components/skin/skin-workspace.tsx'),
  'utf8'
);
const styles = readFileSync(resolve(process.cwd(), 'src/skin.css'), 'utf8');

test('keeps the generator workspace compact and staged', () => {
  expect(component).toContain('skin-source-v51');
  expect(component).toContain('more-options-v51');
  expect(component).toContain('Texture map');
  expect(component).not.toContain('xl:grid-cols-[1fr_0.8fr]');
});

test('stretches the workspace columns and keeps compact option tokens', () => {
  expect(styles).toMatch(
    /\.skin-workspace-v51\s*>\s*div[\s\S]*?align-items:\s*stretch/
  );
  expect(styles).toMatch(
    /\.skin-source-v51[\s\S]*?width:\s*56px[\s\S]*?height:\s*56px/
  );
  expect(styles).toMatch(
    /\.more-options-v51\s+summary[\s\S]*?font-size:\s*12px/
  );
});
