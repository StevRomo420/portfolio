---
order: 1
code: SYS-001
title: Wild Boar
subtitle: Security Operations Platform
status: IN DEVELOPMENT
featured: true
stack: [Django 6, PostgreSQL, Incidents, Audits, Risks, Pentest, Log Explorer, Reporting]
summary: I built Wild Boar to keep incidents, audits, risks, pentest findings and supporting evidence in one Django application.
architectureImage: /images/wild-boar-system-overview.png
architectureCaption: SYSTEM OVERVIEW / IMPLEMENTATION DETAILS CONDENSED
---

I designed Wild Boar for small and medium security teams that need a system they can deploy and maintain without running several separate services.

The modules share role-based access, licence controls, SLA tracking, escalation, notifications, evidence handling and an append-only activity log. The Django interface also produces dashboards and PDF or Excel reports.
