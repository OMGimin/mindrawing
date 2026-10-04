# Mindrawing mockup

Static Korean product mockup in `dist/`. Serve that directory with any static HTTP server. There is no build step, server API, account, or paid AI integration.

## Implementation status

- Three-step wizard: local house/tree/person previews or a synthetic sample, optional parent observations, explicit mock-result consent, and a transparent sample report.
- The report separates uploaded previews from fixed observations and literature-based teaching interpretations of the synthetic sample art. Each feature includes a visible observation, a conditional reading with its source, an alternative explanation, and a question for the child. It does not analyze or diagnose uploaded drawings.
- Opt-in records store only a compact text context and result metadata in browser localStorage. Images and interpretation copy are never persisted; older records reopen with the current reference copy, explicitly marked as such. Storage failures and malformed data are shown to the user.
- Records can be reopened, exported as plain text, printed, or deleted. The plain-text report includes all three reference tabs; printing uses the currently selected tab. Counseling and evidence screens provide official links and clear limits.
- The demo makes no network request for uploaded images and uses no paid AI/API. The only outbound requests from this static site are optional font loading and user-initiated external resource links/searches.

## Verification

Run `npm test` for logic, reference-copy, and controller-flow checks. The controller tests import the production module with a mocked DOM, image decoder, browser storage, and timers. They cover out-of-order image decoding and transition cleanup, sample-to-upload mode selection, and counseling-note source and deletion lifetimes. The reference-copy tests check each tab and the plain-text export. JavaScript module syntax can be checked with `node --check`.

In the preview, the coordinator checked the sample flow, consent blocking, parent notes in the result, local save and refresh recovery, the age-8 counseling path, updated notes after editing, and the 390px evidence layout. The new controller regression cases were verified in the mocked environment; they do not establish behavior in every browser. Real image selection/drop, export/print, and every browser environment were not part of that preview pass.
