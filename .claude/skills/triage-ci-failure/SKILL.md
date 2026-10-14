---
name: triage-ci-failure
description: Triage a failed run of the Android E2E workflow: download its artifacts, read the evidence (logcat, page source, screenshot, Appium log), classify the failure as app bug, test bug or environment, and draft a Jira-ready bug for app bugs. Use when a CI run or nightly failed ("why did the nightly fail", "triage run 123", "the E2E job is red").
---

# Triage a failed CI run

Goal: a classified root cause backed by evidence, never a guess. Say "inconclusive" and what evidence is missing rather than picking the likeliest story.

## 1. Collect

```bash
gh run list --workflow android.yml --limit 10              # find the run (or use the id given)
gh run view <id> --json jobs,headSha --jq '.headSha, (.jobs[] | "\(.name): \(.conclusion)")'
gh run view <id> --log-failed | grep -E "✖|Error:|Spec Files"   # failing tests + first error lines
gh run download <id> -n android-reports     -D reports/triage/<id>/native   # native job
gh run download <id> -n android-web-reports -D reports/triage/<id>/web      # mobile-web job
```

A job with no artifact or no test output failed before the tests: read its step log instead (emulator boot, image download, `npm ci`).

## 2. Read the evidence, in this order

1. `reports/failures/*.xml` (page source at failure): which package was in the foreground? The launcher (`nexuslauncher`) means the app was gone: crash or kill, not a selector problem.
2. `reports/failures/*.png` (open it): what the user would have seen. The `.mp4` is the same moment over time.
3. `logs/logcat-crash.txt`, then `logs/logcat.txt` around the failure time (device clock is UTC in CI): `FATAL EXCEPTION`, `Killing <pid>:com.saucelabs.mydemoapp.rn`, `Displayed ... +Ns`, `ReactNativeJS`.
4. `logs/appium.log`: the commands right before the failure and their durations.

## 3. Classify (known signatures in this repo)

| Evidence | Class | Meaning |
| --- | --- | --- |
| `Killing ...: remove task` right after `START` | Test infra (fixed) | `pm clear` on a visible activity; `resetApp()` must wait for STOPPED |
| `FATAL ... Screen fragments should never be restored`, `handleRelaunchActivity` | App bug | Activity recreated (config change, late `pm clear` broadcasts); `resetApp()` waits for broadcast idle |
| `JavascriptException: Text strings must be rendered within a <Text>` in `CheckoutFooter` | App bug | NaN cart total: product added from a deep-linked product page |
| `Timed out ... root AccessibilityNodeInfo` | Symptom | No window: the app process is dead. Find why in logcat |
| `Displayed ... +20s` or more, no crash | Environment | Slow cold start on a loaded emulator/host |
| `disconnected: not connected to DevTools` | Environment | Chrome renderer lost on the CI emulator |
| `Error on ZipFile unknown archive`, no device | Infra | Corrupt system image download: rerun the job |
| Selector not found and the expected screen IS in the page source | Test bug | Wrong id/timing in our code: fix it, no ticket |

Anything not in the table: follow the evidence and add the new signature to this table in the same PR as the fix.

## 4. Report

- **Test bug / environment / infra**: cause, evidence (file + line or log excerpt), proposed fix or "rerun". No ticket.
- **App bug**: also a Jira-ready draft, in the team's format (Portuguese), ready to paste:

```
Título: [Android] <efeito visível> ao <ação>
Descrição: <o que acontece e em que contexto, 2-3 frases>
Passos para reproduzir:
1. ...
Resultado esperado: ...
Resultado atual: ...
Evidência: <run URL>, <arquivo do artefato> (screenshot/vídeo), trecho do logcat
Severidade: <Crítica | Alta | Média | Baixa> (crash = Alta no mínimo)
Tipo: Bug
```

Never create or update the Jira ticket yourself: hand the draft to the user.
