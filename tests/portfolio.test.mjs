import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the homepage leads with evidence and has a distinctive signal path', async () => {
  const homepage = await read('src/pages/index.astro');

  assert.match(homepage, /class="proof-strip"/);
  assert.match(homepage, /class="signal-path"/);
  assert.match(homepage, /I protect critical infrastructure through <em>security testing, detection, response and hardening\.<\/em>/);
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

test('project copy describes the work without disclosure boilerplate', async () => {
  const source = (await Promise.all([
    read('src/pages/projects/[id].astro'),
    read('src/pages/research/agent-tesla-fileless.astro'),
    read('src/content/projects/cyber-risk-assurance.md'),
    read('src/content/projects/infrastructure-security-assessments.md'),
    read('src/content/projects/proxmox-backup-lab.md'),
    read('src/content/projects/windows-ir-toolkit.md'),
    read('public/images/agent-tesla-execution-analysis.svg'),
    read('public/images/agent-tesla-execution-analysis-mobile.svg'),
    read('public/images/cyber-risk-assurance-lifecycle.svg'),
    read('public/images/cyber-risk-assurance-lifecycle-mobile.svg'),
    read('public/images/incident-response-triage-workflow.svg'),
    read('public/images/infrastructure-security-assessment-workflow.svg'),
    read('public/images/infrastructure-security-assessment-workflow-mobile.svg'),
    read('public/images/nist-aligned-incident-response-plan.svg'),
    read('public/images/nist-aligned-incident-response-plan-mobile.svg'),
    read('public/images/proxmox-backup-production-architecture.svg'),
    read('public/images/proxmox-backup-production-architecture-mobile.svg'),
    read('public/images/wazuh-detection-lifecycle.svg'),
    read('public/images/wazuh-detection-lifecycle-mobile.svg'),
  ])).join('\n');

  assert.doesNotMatch(source, /sanitized|omitted|public (?:version|case|description|view)|deliberately omits|leav(?:es|ing) out|\bexcludes\b/i);
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

test('the custom domain serves public assets from the site root', async () => {
  const config = await read('astro.config.mjs');
  const cname = await read('public/CNAME');

  assert.match(config, /site: 'https:\/\/erosales\.cybershieldrs\.com'/);
  assert.match(config, /base: '\/'/);
  assert.equal(cname.trim(), 'erosales.cybershieldrs.com');
});

test('GitHub Pages builds with the verified Node LTS runtime', async () => {
  const workflow = await read('.github/workflows/deploy.yml');

  assert.match(workflow, /node-version: 22/);
  assert.doesNotMatch(workflow, /node-version: 24/);
});

test('the Proxmox project is classified as production infrastructure', async () => {
  const project = await read('src/content/projects/proxmox-backup-lab.md');
  const template = await read('src/pages/projects/[id].astro');
  const diagram = await read('public/images/proxmox-backup-production-architecture.svg');

  assert.match(project, /code: PROD-002/);
  assert.match(project, /title: Proxmox Backup Infrastructure/);
  assert.match(project, /status: IN PRODUCTION/);
  assert.match(project, /architectureImage: \/images\/proxmox-backup-production-architecture\.svg/);
  assert.match(project, /architectureMobileImage: \/images\/proxmox-backup-production-architecture-mobile\.svg/);
  assert.match(template, /class="project-architecture"/);
  assert.match(template, /<picture>/);
  assert.match(diagram, /BACKUP FLOW/);
  assert.match(diagram, /RESTORE FLOW/);
  assert.match(diagram, /RECOVERY VALIDATION/);
});

test('the malware case renders a restrained technical execution diagram', async () => {
  const page = await read('src/pages/research/agent-tesla-fileless.astro');
  const homepage = await read('src/pages/index.astro');
  const diagram = await read('public/images/agent-tesla-execution-analysis.svg');

  assert.match(page, /agent-tesla-execution-analysis\.svg/);
  assert.match(page, /agent-tesla-execution-analysis-mobile\.svg/);
  assert.match(page, /class="project-architecture malware-architecture"/);
  assert.match(diagram, /OBFUSCATED[\s\S]*SCRIPT/);
  assert.match(diagram, /RC4 DECRYPTION/);
  assert.match(diagram, /IN-MEMORY \.NET/);
  assert.match(diagram, /STATIC ANALYSIS/);
  assert.match(homepage, /class="malware-invite"/);
  assert.match(homepage, /class="malware-invite__steps"/);
  assert.match(homepage, /INPUT[\s\S]*TRACE[\s\S]*EVIDENCE/);
  assert.doesNotMatch(homepage, /EXPLORE THE FULL EXECUTION CHAIN/);
  assert.doesNotMatch(homepage, /class="malware-chain"/);
});

test('Wazuh and the mixed-infrastructure IR program include responsive technical diagrams', async () => {
  const wazuh = await read('src/content/projects/wazuh-detection-lab.md');
  const windowsIr = await read('src/content/projects/windows-ir-toolkit.md');
  const wazuhDiagram = await read('public/images/wazuh-detection-lifecycle.svg');
  const irPlan = await read('public/images/nist-aligned-incident-response-plan.svg');
  const irWorkflow = await read('public/images/incident-response-triage-workflow.svg');

  assert.match(wazuh, /architectureImage: \/images\/wazuh-detection-lifecycle\.svg/);
  assert.match(wazuh, /architectureMobileImage: \/images\/wazuh-detection-lifecycle-mobile\.svg/);
  assert.match(windowsIr, /title: Incident Response Program/);
  assert.match(windowsIr, /NIST-Aligned \/ Windows & Linux Infrastructure/);
  assert.match(windowsIr, /architectureImage: \/images\/nist-aligned-incident-response-plan\.svg/);
  assert.match(windowsIr, /architectureMobileImage: \/images\/nist-aligned-incident-response-plan-mobile\.svg/);
  assert.match(windowsIr, /secondaryArchitectureImage: \/images\/incident-response-triage-workflow\.svg/);
  assert.match(windowsIr, /secondaryArchitectureMobileImage: \/images\/incident-response-triage-workflow-mobile\.svg/);
  assert.match(wazuhDiagram, /TELEMETRY[\s\S]*PARSE[\s\S]*DETECT[\s\S]*VALIDATE[\s\S]*PROMOTE/);
  assert.match(irPlan, /PREPARE[\s\S]*DETECT[\s\S]*RESPOND[\s\S]*RECOVER[\s\S]*IMPROVE/);
  assert.match(irWorkflow, /WINDOWS[\s\S]*LINUX[\s\S]*ACQUIRE[\s\S]*TRIAGE[\s\S]*CORRELATE[\s\S]*CONTAIN/);
});

test('the Ansible case communicates a complete hardening feedback loop', async () => {
  const homepage = await read('src/pages/index.astro');

  assert.match(homepage, /MANUAL STATE[\s\S]*APPLY BASELINE[\s\S]*VERIFY[\s\S]*REMEDIATE/);
});

test('the featured Wild Boar card teases the system without rendering the full diagram', async () => {
  const project = await read('src/content/projects/wild-boar.md');
  const homepage = await read('src/pages/index.astro');

  assert.match(project, /architectureImage: \/images\/wild-boar-system-overview\.png/);
  assert.match(homepage, /class="wild-boar-teaser"/);
  assert.match(homepage, /SECURITY WORK[\s\S]*GOVERN · OPERATE · EVIDENCE/);
  assert.doesNotMatch(homepage, /featured\.data\.architectureImage/);
  assert.doesNotMatch(homepage, /01 \/ COLLECT[\s\S]*02 \/ CORRELATE[\s\S]*03 \/ RESPOND/);
});

test('portfolio copy uses direct practitioner language instead of generic marketing prose', async () => {
  const source = (await Promise.all([
    read('src/pages/index.astro'),
    read('src/pages/research/agent-tesla-fileless.astro'),
    read('src/content/projects/proxmox-backup-lab.md'),
    read('src/content/projects/wazuh-detection-lab.md'),
    read('src/content/projects/wild-boar.md'),
    read('src/content/projects/windows-ir-toolkit.md'),
  ])).join('\n');

  assert.match(source, /I built|I developed|I use this lab/);
  assert.doesNotMatch(source, /one governed workspace|defensible evidence|provides a controlled backup path|evidence-led technical workflow/);
});

test('risk assurance and infrastructure assessment experience are published as professional projects', async () => {
  const risk = await read('src/content/projects/cyber-risk-assurance.md');
  const assessment = await read('src/content/projects/infrastructure-security-assessments.md');
  const homepage = await read('src/pages/index.astro');

  assert.match(risk, /title: Cyber Risk & Security Assurance/);
  assert.match(risk, /architectureImage: \/images\/cyber-risk-assurance-lifecycle\.svg/);
  assert.match(risk, /architectureMobileImage: \/images\/cyber-risk-assurance-lifecycle-mobile\.svg/);
  assert.match(assessment, /title: Infrastructure Security Assessments/);
  assert.match(assessment, /architectureImage: \/images\/infrastructure-security-assessment-workflow\.svg/);
  assert.match(assessment, /architectureMobileImage: \/images\/infrastructure-security-assessment-workflow-mobile\.svg/);
  assert.match(homepage, /Security Assurance/);
  assert.match(homepage, /risk assessment/i);
  assert.match(homepage, /security awareness/i);
});

test('new professional cases use first-person ownership without exposing internal identifiers', async () => {
  const source = (await Promise.all([
    read('src/content/projects/cyber-risk-assurance.md'),
    read('src/content/projects/infrastructure-security-assessments.md'),
  ])).join('\n');

  assert.match(source, /I designed|I carried out|I developed/);
  assert.doesNotMatch(source, /HCSRA|Cl[ií]nica B[ií]blica|hostname|IP address|account name/i);
});

test('new assurance diagrams communicate short readable workflows', async () => {
  const risk = await read('public/images/cyber-risk-assurance-lifecycle.svg');
  const riskMobile = await read('public/images/cyber-risk-assurance-lifecycle-mobile.svg');
  const assessment = await read('public/images/infrastructure-security-assessment-workflow.svg');
  const assessmentMobile = await read('public/images/infrastructure-security-assessment-workflow-mobile.svg');

  assert.match(risk, /IDENTIFY[\s\S]*ASSESS[\s\S]*PRIORITIZE[\s\S]*TREAT[\s\S]*FOLLOW UP/);
  assert.match(assessment, /SCOPE[\s\S]*ASSESS[\s\S]*VALIDATE[\s\S]*REPORT[\s\S]*IMPROVE/);
  for (const diagram of [risk, riskMobile, assessment, assessmentMobile]) {
    assert.match(diagram, /viewBox=/);
    assert.doesNotMatch(diagram, /HCSRA|Cl[ií]nica B[ií]blica|\b(?:\d{1,3}\.){3}\d{1,3}\b/i);
  }
});
