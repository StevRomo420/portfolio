# Esteban Rosales — Security Engineering Portfolio

A content-driven Astro portfolio built around **Security Operations Console + Case Files** rather than a generic résumé landing page.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Add or update a project

Projects are Markdown files in `src/content/projects/`.

Duplicate one of the existing `.md` files and edit its frontmatter:

```yaml
---
order: 5
code: LAB-005
title: New Project
subtitle: Security Engineering
status: IN DEVELOPMENT
featured: false
stack: [Tool A, Tool B]
summary: Short description shown on the homepage.
---
```

The project automatically appears in the Labs section and gets its own `/projects/<filename>/` page.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to the `main` branch.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Push a commit. `.github/workflows/deploy.yml` uses Astro’s official Pages action to install, build, upload and deploy the site.

The Astro config detects whether the repository is a user site (`username.github.io`) or a project site and sets the base path accordingly during GitHub Actions builds.

## Replace links

Before publishing, update the GitHub placeholder in `src/components/Sidebar.astro` with the final GitHub profile URL.

The LinkedIn URL, email CTA and CV download are already wired from the supplied résumé.

## Content safety

Case studies are intentionally written to demonstrate engineering choices and outcomes without exposing production IPs, hostnames, credentials, exact topology, firewall rules or sensitive detection logic.

## Malware research case

The portfolio also includes `CASE-004`, a condensed reverse-engineering case study of a staged Agent Tesla fileless execution chain. The detailed route is `/research/agent-tesla-fileless/` and links back to the original LinkedIn publication.
