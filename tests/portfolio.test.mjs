import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the homepage leads with evidence and has a distinctive signal path', async () => {
  const homepage = await read('src/pages/index.astro');

  assert.match(homepage, /class="proof-strip"/);
  assert.match(homepage, /class="signal-path"/);
  assert.match(homepage, /PROBLEM[\s\S]*INTERVENTION[\s\S]*OUTCOME/);
});

test('the portfolio contains no placeholder copy or broken UTF-8 sequences', async () => {
  const files = await Promise.all([
    read('src/pages/index.astro'),
    read('src/layouts/BaseLayout.astro'),
    read('src/components/Sidebar.astro'),
    read('src/styles/global.css'),
  ]);
  const source = files.join('\n');

  assert.doesNotMatch(source, /Reserved for future|project-placeholder/);
  assert.doesNotMatch(source, /Ã|Â|â€|â†|âˆ/);
});

test('interactive elements expose visible keyboard focus styles', async () => {
  const styles = await read('src/styles/global.css');
  assert.match(styles, /:focus-visible/);
});

test('all contact links use the approved email address', async () => {
  const source = (await Promise.all([
    read('src/pages/index.astro'),
    read('src/components/Sidebar.astro'),
  ])).join('\n');

  assert.match(source, /mailto:esteban5420978@hotmail\.com/);
  assert.doesNotMatch(source, /estebanrosalesmora@gmail\.com/);
});

test('desktop screens receive an explicit readability scale', async () => {
  const styles = await read('src/styles/global.css');

  assert.match(styles, /@media \(min-width: 821px\)/);
  assert.match(styles, /--desktop-body: 18px/);
  assert.match(styles, /--desktop-copy: 17px/);
  assert.match(styles, /--desktop-label: 13px/);
  assert.match(styles, /\.side-nav \{[^}]*font-size: 14px/);
  assert.match(styles, /\.button \{[^}]*font-size: var\(--desktop-label\)/);
});

test('the final responsive layer protects links and utility text at every size', async () => {
  const styles = await read('src/styles/global.css');
  const finalLayer = styles.indexOf('/* Final accessibility layer */');
  const researchRules = styles.indexOf('.research-note');

  assert.ok(finalLayer > researchRules, 'accessibility overrides must follow all component rules');
  assert.match(styles.slice(finalLayer), /\.case-links a[^}]*min-height: 44px/);
  assert.match(styles.slice(finalLayer), /\.project-back[^}]*min-height: 44px/);
  assert.match(styles.slice(finalLayer), /@media \(max-width: 820px\)[\s\S]*font-size: 12px/);
});

test('Esteban Rosales is exposed as a visible identity across page contexts', async () => {
  const source = (await Promise.all([
    read('src/components/Sidebar.astro'),
    read('src/pages/research/agent-tesla-fileless.astro'),
    read('src/pages/projects/[id].astro'),
  ])).join('\n');

  assert.ok((source.match(/class="identity-name"/g) ?? []).length >= 3);
  assert.match(source, />ESTEBAN ROSALES</);
});

test('the homepage presents the owner name as a prominent signature', async () => {
  const homepage = await read('src/pages/index.astro');
  const styles = await read('src/styles/global.css');

  assert.match(homepage, /class="hero-signature"/);
  assert.match(homepage, /class="hero-signature__name">ESTEBAN ROSALES/);
  assert.match(styles, /\.hero-signature__name[^}]*font-size: 24px/);
  assert.match(styles, /@media \(max-width: 820px\)[\s\S]*\.hero-signature__name[^}]*font-size: 18px/);
});

test('the GitHub Pages base path ends with a slash before public assets', async () => {
  const config = await read('astro.config.mjs');

  assert.match(config, /`\/\$\{repo\}\/`/);
  assert.doesNotMatch(config, /`\/\$\{repo\}`/);
});
