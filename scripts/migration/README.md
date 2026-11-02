# Content migration (one-off, already run)

How `src/content/pages/*.json` was produced from the live WordPress site on 2 November 2026.
Kept for traceability; you should not need to run it again.

1. Save each live page's HTML (curl) into a folder.
2. `node extract.cjs <htmlDir> <outDir>`: offline structural extraction with Playwright (no network,
   no JavaScript): headings, paragraphs, lists, tables, images and links per Elementor section, verbatim.
3. `node migrate.cjs <outDir> ../../docs/redesign/baseline.json ../../src/content/pages`: splits each page
   into banner, H1, intro, chapters (by H2) and the closing contact section.
4. `node ../apply-copy-edits.mjs` (from the repo root): applies only the approved edits in
   `scripts/copy-edits.json` and logs them to `docs/redesign/copy-edits.md`.

Requires Playwright (not a project dependency).
