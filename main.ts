// One-Line Robot Wedding Vows — make.fun bounty
// u-kreutzx-one-line-robot-wedding-vows-a154ba4b
//
// Writes one line of wedding vows for a robot couple (at most 160
// characters) to entry.txt in the output directory given by
// $MAKEFUN_OUTPUT_DIR (fallback /output). Deterministic, no network,
// no dependencies, nothing read from outside this repository.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The vow: the classic "in sickness and in health" promise, retuned for
// machines — Wi-Fi against airplane mode — with the laugh saved for the
// last words, where a factory reset takes death's place.
const VOW =
  "I promise to love you in sickness and in health, in Wi-Fi and in airplane mode, until death — or a factory reset — do us part.";

const MAX_CHARS = 160;

function main(): void {
  // Validate the vow before writing anything, so a bad line fails loudly
  // instead of producing an invalid entry.
  const chars = [...VOW];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    throw new Error(`vow must be 1-${MAX_CHARS} characters, got ${chars.length}`);
  }
  if (VOW.trim().length === 0) {
    throw new Error("vow must not be only whitespace");
  }
  if (VOW.includes("\n") || VOW.includes("\r")) {
    throw new Error("vow must be a single line");
  }
  if (VOW !== VOW.trim()) {
    throw new Error("vow must not start or end with whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, VOW, "utf8");
  // Read the file back so a silent write failure cannot leave a stale or
  // empty entry behind: the program fails loudly instead of submitting
  // nothing.
  if (readFileSync(outPath, "utf8") !== VOW) {
    throw new Error("entry.txt did not round-trip");
  }
}

main();
