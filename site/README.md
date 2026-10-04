# Mindrawing mockup

Static Korean product mockup in `dist/`. Serve that directory with any static HTTP server. There is no build step, server API, account, or paid AI integration.

## Implementation status

- Three-step wizard: local house/tree/person previews or a synthetic sample, optional parent observations, explicit mock-result consent, and a transparent sample report.
- The report separates uploaded previews from fixed observations of the synthetic sample art. It does not analyze or diagnose the uploaded drawings.
- Opt-in records store only a compact text context and result metadata in browser localStorage. Images are never persisted; storage failures and malformed data are shown to the user.
- Records can be reopened, exported as plain text, printed, or deleted. Counseling and evidence screens provide official links and clear limits.
- The demo makes no network request for uploaded images and uses no paid AI/API. The only outbound requests from this static site are optional font loading and user-initiated external resource links/searches.

## Verification

Run `npm test` for focused logic checks. JavaScript module syntax was checked with `node --check`.

In the preview, the coordinator checked the sample flow, consent blocking, parent notes in the result, local save and refresh recovery, the age-8 counseling path, updated notes after editing, and the 390px evidence layout. Real image selection/drop, export/print, deletion, and every browser environment were not yet part of that pass.
