/**
 * Generate middleware.js.nft.json from the middleware-manifest.json.
 *
 * Next.js 16 + Turbopack compiles middleware/proxy as Edge Runtime bundles
 * stored under .next/server/edge/chunks/. The NFT (Node File Trace) system
 * only traces Node.js modules, so it never produces a trace file for Edge
 * middleware. Vercel's deployment step still expects
 * .next/server/middleware.js.nft.json to exist, causing an ENOENT error.
 *
 * This script reads the middleware-manifest.json (which lists the actual
 * Edge chunk files) and generates the missing .nft.json with the correct
 * file references.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dotNext = join(process.cwd(), ".next");
const manifestPath = join(dotNext, "server", "middleware", "middleware-manifest.json");
const nftPath = join(dotNext, "server", "middleware.js.nft.json");

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

// Collect every file referenced by middleware entries and map paths from
// the .next root (e.g. "server/edge/chunks/foo.js") to be relative to
// .next/server/ (e.g. "edge/chunks/foo.js").
const files = new Set();

for (const entry of Object.values(manifest.middleware ?? {})) {
  for (const file of entry.files ?? []) {
    files.add(file.startsWith("server/") ? file.slice("server/".length) : file);
  }
}

writeFileSync(nftPath, JSON.stringify({ version: 1, files: [...files] }));
console.log(
  `Generated middleware.js.nft.json with ${files.size} file(s)`
);
