# CLAUDE.md

Guidance for working in this repo.

## What this is

A **Bitcoin Script IDE** — a browser-based tool to learn/test/teach Bitcoin Script (syntax highlighting, autocomplete, assembly translation, animated stack visualizer, step debugger). It is a fork of the [ACE editor](https://github.com/ajaxorg/ace) (v1.1.8) with a Bitcoin-specific UI and interpreter layered on top.

Pure static site — no backend, no build step needed to run. Deployed to GitHub Pages; `index.html` redirects to `build/editor.html`.

## Run it

Open `build/editor.html` in a browser (or serve the repo root, e.g. `python static.py` / `node static.js`, then hit `/build/editor.html`). No install required for the IDE itself.

## Architecture — two layers

**1. The Bitcoin IDE (hand-written, lives in `build/`).** Despite the `build/` name these are NOT generated artifacts — they are the actual, committed source of the app. `build/editor.html` loads them directly as plain `<script>` tags:

- `build/editor.html` — the IDE page (Bootstrap 3 + jQuery from CDN). Creates two ACE editors (`editor` for script, `editor-assembly`), both using `ace/mode/script` + theme `merbivore`.
- `build/editor.js` — page wiring; binds Run / Step / Continue buttons to the debugger; keeps `scriptDebugger.commands` in sync on edit.
- `build/script_interpreter/interpreter.js` — **the Bitcoin Script interpreter.** `validateScript` checks IF/ELSE/ENDIF control flow; `nextStep(mainstack, altstack, script, index)` executes one opcode (big `switch` over `OP_*`). Add/fix opcode behavior here.
- `build/script_interpreter/{sha1,sha256,ripemd160}.js` — hash primitives used by crypto opcodes.
- `build/assembly.js` — `assembleToHex` / `disassembleFromHex`, plus the `commandToOpcode` map (opcode name ↔ byte). The interpreter reads `commandToOpcode` to know what is a valid opcode.
- `build/debugger.js` — `ScriptDebugger`: `runFromBeginning`, `nextStep`, `continueExecution`, `splitScript`; drives the interpreter and the visualizer.
- `build/stack-visualizer.js` — `StackVisualizer`, the animated jQuery stack diagram.

**2. The ACE editor + Bitcoin language mode (`lib/`).** Standard ACE source tree. Bitcoin-specific pieces:

- `lib/ace/mode/script.js` + `lib/ace/mode/script_highlight_rules.js` — the "Bitcoin Script" language mode (`ace/mode/script`), syntax highlighting.
- `lib/ace/snippets/script.snippets` — opcode autocomplete snippets.

## Important gotcha: `lib/` vs `build/src*`

`build/editor.html` loads the **built** ACE from `build/src-noconflict/ace.js`, and the mode from `build/src-noconflict/mode-script.js` / `build/src-noconflict/snippets/script.js`. It does **not** load `lib/` at runtime.

So changing the language mode or snippets in `lib/` has no effect until ACE is rebuilt. Options:
- Rebuild ACE: `make` (runs `Makefile.dryice.js`), which regenerates `build/src*`.
- Or edit the built copy directly (`build/src-noconflict/mode-script.js`, etc.) for a quick change.

Interpreter / IDE-behavior changes (`build/*.js`, `build/script_interpreter/*.js`) need no build — just reload the page.

## Conventions

- Match surrounding style: ES5, jQuery, tab indentation in the `build/` files.
- Opcode work touches two places in tandem: `commandToOpcode` in `build/assembly.js` (recognition) and the `switch` in `build/script_interpreter/interpreter.js` (execution).
- There is no test/lint setup for the Bitcoin code. `package.json`'s `test` script runs ACE's own upstream tests, not this fork's.
