# Build-only devDependency audit — 2026-07-15

**Scope:** Task 5 of the frontend-security-hardening plan
(`docs/superpowers/plans/2026-07-15-frontend-security-hardening.md`). Audits the
root `package.json` packages that exist solely to **rebuild ACE** (via `make`
→ `Makefile.dryice.js`) or to run the local dev server (`static.js`). None of
these packages are shipped to browser users.

## Why these are out of scope for "fix everything"

As of commit `583dd23d` (Tasks 1–4 of this plan), the **shipped frontend is
fully vendored and patched** under `build/vendor/` — jQuery 3.7.1, Bootstrap
5.3.3, jQuery UI 1.13.3, jquery.color 2.2.0, FileSaver 2.0.5, Bootstrap Icons
1.11.3, all loaded from local `<script>`/`<link>` tags in `build/editor.html`
with zero CDN references (verified in Task 4/6). The packages audited here
never reach the browser:

- The five `devDependencies` (`asyncjs`, `jsdom`, `amd-loader`, `dryice`,
  `architect-build`) are inputs to the ACE build pipeline
  (`Makefile.dryice.js` → `make`) that regenerates `build/src-noconflict/`.
  The Bitcoin IDE itself (`build/*.js`, `build/script_interpreter/*.js`)
  needs no build step and does not invoke this pipeline.
- `mime` (a runtime `dependency`, not a devDependency) is used only by
  `static.js` (`require("mime")`, `mime.lookup(filename)` at `static.js:38`),
  a local development HTTP server for previewing the repo. It never executes
  in a user's browser and is not part of the deployed GitHub Pages artifact.

**No lockfile is committed to the repo.** (A `package-lock.json` may exist
locally as a byproduct of `npm install --ignore-scripts` for `@playwright/test`
in Task 1 — it resolves these legacy packages successfully in `node_modules/`,
but it is untracked/uncommitted, so the committed repo state has no lockfile
and no pinned transitive tree.) These packages predate `npm audit`'s
lockfile-based model; some fail to build natively on Node 20, and modernizing
the ACE build chain is explicitly out of scope for this effort (see Global
Constraints in the plan: "Do not touch the ACE editor core").

## Method

For each package, resolved the version actually pinned in `package.json`
against the npm registry, then queried the GitHub Advisory Database
(`api.github.com/advisories?ecosystem=npm&affects=<pkg>`) for any advisory —
reviewed or withdrawn — whose vulnerable range covers that version.

## Findings

| Package | Pinned range | Resolved version | Advisory found | Severity | Affects shipped app? | Disposition |
|---|---|---|---|---|---|---|
| `asyncjs` | `0.0.x` | 0.0.13 | none | — | No (build-only) | **Accepted** |
| `jsdom` | `0.2.x` | 0.2.19 | `GHSA-f4c9-cqv8-9v98` ("Insufficient Granularity of Access Control in JSDom") — **withdrawn**, low severity, targets a much later jsdom version range (≤16.4.0, effectively a modern-jsdom concern) | Low, withdrawn | No (build-only) | **Accepted** |
| `amd-loader` | `~0.0.4` | 0.0.8 | none | — | No (build-only) | **Accepted** |
| `dryice` | `0.4.11` | 0.4.11 | none | — | No (build-only) | **Accepted** |
| `architect-build` | github tarball `c9/architect-build#a3bad51808` | pinned commit | none (not resolvable to an audited npm advisory range; the npm-registry `architect-build` package, a different publish path, also has none) | — | No (build-only) | **Accepted** |
| `mime` | `1.2.x` | 1.2.11 | `GHSA-wrvr-8mpx-r7pp` / `CVE-2017-16138` — ReDoS via untrusted input to MIME lookup, vulnerable range `< 1.4.1` (our 1.2.11 is in range) | **High** (CVSS 3.0 7.5), **not Critical** | No (dev-server-only via `static.js`; not part of the shipped `build/` frontend) | **Accepted** (see note below) |

No **critical**-severity advisory was found for any of the six packages.
Per the plan's gate ("address only genuine critical advisories where the fix
does not break the ACE rebuild"), no `package.json` change is made in this
task.

### Note on `mime` (the one non-trivial finding)

`mime@1.2.x` resolves to 1.2.11, which sits inside the vulnerable range of a
real, GitHub-reviewed ReDoS advisory (`GHSA-wrvr-8mpx-r7pp`, CVSS 7.5, rated
**High**). This is the only finding among the six that corresponds to an
actual, non-withdrawn advisory. It is disposed as **accepted** rather than
fixed because:

1. It is rated **High**, not **Critical** — outside the strict fix gate this
   task operates under.
2. It has no browser-facing blast radius: `mime.lookup()` in `static.js` is
   only ever called with local repo filenames from `fs.readdir`/request-path
   handling in a throwaway dev server, not with attacker-controlled remote
   input, and it never ships to end users.

A non-breaking fix does exist if this is ever revisited outside this task's
gate: bump to `"mime": "^1.4.1"` (any 1.4.1+ minor, same major, same
`mime.lookup()` API used by `static.js:38`) — a drop-in, one-line
`package.json` change with no ACE-rebuild impact, since `mime` is not part of
the ACE `Makefile.dryice.js` toolchain. Flagging this as a recommendation for
a future pass rather than applying it here, to keep this task's diff strictly
inside its documented gate (critical-only auto-fix).

## Disposition summary

All six build-only/dev-server-only packages: **accepted, documented, no code
change.** Zero critical advisories exist among them. The one real advisory
found (`mime`, High/CVSS 7.5) does not meet this task's critical-only fix bar
and does not affect the shipped frontend, so it is documented here rather
than patched.

---

## Vendored frontend libraries — provenance

For completeness, this note also records where each vendored library under
`build/vendor/` (the actual shipped frontend, Tasks 2–4) came from, since
that provenance underpins the "not shipped / accepted" reasoning above for
the build-only packages.

All vendored files were downloaded from **pinned cdnjs version URLs** and
verified against **cdnjs-published SRI (sha512)** hashes, **except**:

- **`jquery.color-2.2.0.min.js`** — cdnjs never published `jquery-color`
  past version 2.1.2 (confirmed via `api.cdnjs.com/libraries/jquery-color`,
  which lists only 2.0.0/2.1.0/2.1.1/2.1.2). Version 2.2.0 genuinely exists
  on the npm registry, just not mirrored to cdnjs. This file was instead
  downloaded from **jsDelivr's npm mirror**
  (`https://cdn.jsdelivr.net/npm/jquery-color@2.2.0/dist/jquery.color.min.js`)
  and verified against **jsDelivr's own published sha256** for that package
  file (from `data.jsdelivr.com/v1/packages/npm/jquery-color@2.2.0`;
  published sha256 base64 `aSe2ZC5QeunlL/w/7PsVKmV+fa0eDbmybn/ptsKHR6I=`),
  which the computed hash matched. This was documented at the time in
  `.superpowers/sdd/task-2-report.md` ("Deviation: jquery.color-2.2.0.min.js
  not available on cdnjs").

Every vendored file's sha256 is recorded in `build/vendor/CHECKSUMS.txt`; a
provenance comment for the `jquery.color` exception has been added directly
to that file (see below) so the non-cdnjs sourcing is visible in the
artifact itself, not only in this report.
