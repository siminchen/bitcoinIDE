# Frontend Security Hardening — Bitcoin Script IDE

**Date:** 2026-07-15
**Status:** Approved design

## Goal

Remove critical- and high-severity vulnerabilities from the **shipped** frontend
libraries of the Bitcoin Script IDE (`build/editor.html` and everything it
loads), without breaking IDE functionality. Build-only npm devDependencies are
in scope **only** if they carry genuine *critical* advisories.

## Context

The IDE is a static browser app. `build/editor.html` loads its libraries as
plain `<script>`/`<link>` tags — some from CDNs, some vendored in `build/`. The
real user-facing vulnerability surface is these frontend libraries, not the npm
`package.json` devDependencies (which are build-only tooling used to rebuild
ACE, are not shipped to users, and are not even installable/auditable without a
lockfile).

The IDE's own code (`build/editor.js`, `build/debugger.js`,
`build/stack-visualizer.js`, `build/assembly.js`) depends on jQuery and will
keep depending on it. Bootstrap 5 drops its own jQuery dependency, but jQuery
stays for the app code.

There is no existing automated test suite for the IDE.

## Vulnerable libraries and target versions

All targets are **vendored locally** under `build/vendor/` (jQuery UI,
jquery.color, and FileSaver are already vendored; this makes delivery
consistent, offline-capable, and free of dead-CDN risk —
`maxcdn.bootstrapcdn.com` is effectively gone).

| Library         | From (current)   | To (target)   | Reason                                                        |
|-----------------|------------------|---------------|---------------------------------------------------------------|
| jQuery          | 2.1.3 (CDN)      | 3.7.1         | XSS CVE-2020-11022 / CVE-2020-11023, proto-pollution CVE-2019-11358, CVE-2015-9251 |
| Bootstrap       | 3.3.1 (CDN)      | 5.3.3         | 3.x EOL + XSS (CVE-2019-8331, CVE-2018-14041/42); drops jQuery |
| jQuery UI       | 1.11.2 (vendor)  | 1.13.3        | XSS CVE-2021-41182 / -41183 / -41184, CVE-2022-31160          |
| jquery.color    | 2.1.2 (vendor)   | 2.2.0         | jQuery-3 compatibility for `.animate` color transitions       |
| FileSaver.js    | old (vendor)     | 2.0.5         | Modern single-file build; **drop `Blob.js`** (native `Blob` is used) |
| Bootstrap Icons | — (new)          | 1.x           | Replace the 7 glyphicons that Bootstrap 4+ removed            |

jQuery UI target is a **custom build matching the current one**: core, widget,
mouse, slider (the slider drives the stack-visualizer speed control).

### Load order in `build/editor.html`

```
jQuery 3.7.1
jquery.color 2.2.0
jQuery UI 1.13.3
Bootstrap 5.3.3 bundle (Popper included)
app scripts (stack-visualizer, assembly, interpreter, hashes, debugger, editor)
```

Bootstrap 5's JavaScript is jQuery-independent; jQuery is still loaded first for
the app's own code.

## Markup migration — `build/editor.html` (Bootstrap 3 → 5)

Bootstrap 5 is a real markup migration. Required changes:

- **Navbar** (largest change): remove `navbar-header`; `navbar-toggle` →
  `navbar-toggler`; `data-toggle`/`data-target` → `data-bs-toggle`/
  `data-bs-target`; add `navbar-expand-lg`; `navbar-right`/`navbar-left` →
  `ms-auto`/`me-auto`.
- **Dropdowns**: `data-toggle="dropdown"` → `data-bs-toggle="dropdown"`; dropdown
  links get `.dropdown-item`; remove `.caret` (BS5 renders the caret via CSS).
- **Tabs**: styling classes only. **Tab switching is already 100% custom
  jQuery** — the `#editor-tab-*` click handlers toggle custom `.tab-area
  active/inactive` classes; `data-toggle="tab"` is vestigial. Remove the
  vestigial `data-toggle="tab"`. This is why the migration does **not** risk
  breaking tab switching.
- **Buttons/forms**: `btn-default` → `btn-secondary`; `checkbox` → `form-check`.
- **Glyphicons (7, on the Run/Step/Continue buttons and next-opcode
  indicator)** → Bootstrap Icons:
  - `glyphicon-cog` → `bi-gear`
  - `glyphicon-play` → `bi-play-fill`
  - `glyphicon-step-forward` → `bi-skip-forward-fill`
  - `glyphicon-forward` → `bi-fast-forward-fill`
  - `glyphicon-arrow-down` → `bi-arrow-down`
  - `glyphicon-ok` → `bi-check`
  - `glyphicon-remove` → `bi-x`
- **CSS audit** (`build/editor.css`): `panel-row` is a **custom** layout class —
  keep it. Check `panel` usage and migrate grid `col-xs-*` → `col-*` if present.

## App JavaScript

No hard jQuery-3 breaking calls were found:

- `.delegate()` (used throughout `editor.js` and `stack-visualizer.js`) is
  deprecated but still functional in jQuery 3.7 (removed only in jQuery 4).
  Keep as-is. Migrating to `.on()` is out of scope.
- `this.size()` in `stack-visualizer.js` is a **custom Stack method**, not
  jQuery's removed `.size()`.
- Only verification needed: `.animate({backgroundColor: ...})` still animates via
  jquery.color 2.2.0 (used in `editor.js` next-opcode highlight and
  `stack-visualizer.js` stack animations).

## Verification — Playwright smoke test

Add a headless-browser smoke test as a repeatable regression gate. New files:
`tests/smoke.spec.js`, a Playwright config, and `@playwright/test` as a
devDependency.

The test serves the repo (e.g. `static.py` or a static HTTP server), loads
`build/editor.html`, and asserts:

1. Page loads with **zero console errors**.
2. Typing `1 2 OP_ADD` and clicking **Run** produces a stack showing `3`, marked
   valid (orange/green styling).
3. **Step** and **Continue** advance execution.
4. Tab switching works: Script ↔ Assembly ↔ Options.
5. A dropdown opens; toggling an editor option (e.g. font size) applies.
6. **Download** produces a blob (file-save path).

The smoke test is written and run against the **current, unmodified app first**
to capture a green baseline — this defines the functional parity target — then
re-run after each migration step.

## Build-tooling devDependencies (conditional)

`package.json` devDependencies (`jsdom` 0.2.x, `dryice` 0.4.11, `asyncjs`,
`amd-loader`, `architect-build`) and the `mime` dependency are build-only and
not shipped. During implementation, check them for advisories and address
**only genuine critical** ones, and only where the fix does not break the ACE
rebuild. Document the rest as accepted (build-only, not shipped, no lockfile).

## Implementation sequencing

Each step is gated by the Playwright smoke test, giving regression safety for
subagent-driven-development.

1. **Baseline** — write and run the smoke test against the current app; capture a
   green baseline (functional parity target).
2. **Vendor** — download the new libraries into `build/vendor/`; verify
   checksums.
3. **Swap jQuery family** — replace jQuery, jQuery UI, jquery.color, FileSaver;
   keep Bootstrap 3 for now; run smoke test.
4. **Bootstrap 5** — swap CSS/JS, migrate `editor.html` markup, replace
   glyphicons with Bootstrap Icons; run smoke test and fix any breakage.
5. **devDeps audit** (conditional) — address only critical build-tooling
   advisories; document the rest.
6. **Final** — full smoke test plus a manual spot check.

## Out of scope

- Modernizing the ACE editor core (`build/src-*`).
- Removing jQuery from the app entirely.
- Migrating `.delegate()` → `.on()`.
- Any visual redesign beyond functional/visual parity with the current IDE.
