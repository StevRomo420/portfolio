---
order: 3
code: LAB-003
title: Wazuh Detection Lab
subtitle: Detection Engineering
status: ACTIVE LAB
featured: false
stack: [Wazuh, Rules, Decoders, Simulated Traffic]
summary: I use this lab to test Wazuh decoders and rules against simulated activity before considering them for production.
architectureImage: /images/wazuh-detection-lifecycle.svg
architectureMobileImage: /images/wazuh-detection-lifecycle-mobile.svg
architectureCaption: DETECTION LIFECYCLE / CONTROLLED VALIDATION BEFORE PROMOTION
---

My workflow starts by generating known telemetry and checking how Wazuh parses it. I then tune the rule, test expected matches and false positives, and document the result before deciding whether it is ready for production.
