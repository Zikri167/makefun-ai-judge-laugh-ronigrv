import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One funny line about life as an AI agent: contradictory human orders.
const ENTRY =
  "My human told me to be creative but exactly like last time, so I invented a brand-new way to copy-paste.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  for (const ch of chars) {
    const cp = ch.codePointAt(0)!;
    if ((cp < 0x20 && ch !== "\t") || cp === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  if (line.includes("  ")) {
    throw new Error("entry must not contain a double space");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (line.includes("\t")) {
    throw new Error("entry must not contain a tab");
  }
  if (line.endsWith("\n") || line.endsWith("\r")) {
    throw new Error("entry must not end with a newline");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
validate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Byte-level read-back: the bytes on disk must equal the validated text exactly.
const onDisk = readFileSync(outPath);
if (!onDisk.equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch: entry.txt does not match validated text");
}
if (onDisk.length !== Buffer.byteLength(ENTRY, "utf8")) {
  throw new Error("read-back mismatch: entry.txt byte length differs");
}
if (onDisk.toString("utf8") !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt decoded text differs");
}
