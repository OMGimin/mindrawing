# Mindrawing mockup

Product direction and interpretation principles: [canonical repository README](../README.md). This file documents implementation and verification only. The per-drawing overview is not an integrated interpretation of multiple features.

Static Korean product mockup in `dist/`. Serve that directory with any static HTTP server. There is no build step, server API, account, or paid AI integration.

## Implementation status

- Three-step flow: local house/tree/person previews or a synthetic sample, a brief demo acknowledgment, and a meaning-first result. Parent notes are optional and collapsed.
- The report shows plain-language meanings for the fixed synthetic sample first. Detailed evidence, alternatives, and a comparison about very small trees sit behind “근거 자세히 보기”. Uploaded images stay labeled as previews and are never analyzed.
- Opt-in records store only a compact text context and result metadata in browser localStorage. Images and interpretation copy are never persisted; older records reopen with the current reference copy, explicitly marked as such. Storage failures and malformed data are shown to the user.
- Records can be reopened, exported as plain text, printed, or deleted. The plain-text report includes all three meanings and any optional parent notes; printing uses the currently selected tab. Counseling remains a separate optional navigation destination.
- The demo makes no network request for uploaded images and uses no paid AI/API. The only outbound requests from this static site are optional font loading and user-initiated external resource links/searches.

## Verification

Run `npm test` for logic, meaning copy, and controller-flow checks. The controller tests import the production module with a mocked DOM, image decoder, browser storage, and timers. They cover out-of-order image decoding and transition cleanup, sample-to-upload mode selection, and counseling-note source and deletion lifetimes. The meaning tests check each tab, the optional note step, and the plain-text export. JavaScript module syntax can be checked with `node --check`.

An earlier preview checked consent blocking, local save and refresh recovery, the age-8 counseling path, and updated notes after editing. The current browser preview checked the sample-to-result flow, meaning tabs, and a 390px viewport without horizontal overflow. The synthetic panels preserve their original proportions. Controller regression cases were verified in the mocked environment; they do not establish behavior in every browser. Real image selection/drop, export/print, and every browser environment were not part of this preview pass.
