import { defineConfig } from 'astro/config';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserSite = Boolean(owner && repo === `${owner}.github.io`);

export default defineConfig({
  output: 'static',
  site: owner ? `https://${owner}.github.io` : 'http://localhost:4321',
  base: repo && !isUserSite ? `/${repo}` : '/',
});
