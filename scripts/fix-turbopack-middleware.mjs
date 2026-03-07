/**
 * Fix Next.js 16 + Turbopack middleware deployment on Vercel.
 *
 * Bug: Next.js 16 writes `/_middleware: { runtime: "nodejs" }` into
 * `functions-config-manifest.json` when it detects `proxy.ts`, but
 * Turbopack does NOT generate the corresponding `middleware.js` or
 * `middleware.js.nft.json` files (the rename from proxy→middleware is
 * skipped for Turbopack — see next/dist/build/index.js:2507).
 *
 * When @vercel/next reads the manifest and finds `/_middleware`, it
 * enters `getNodeMiddleware()` which tries to read
 * `middleware.js.nft.json` → ENOENT.
 *
 * Fix: Remove the `/_middleware` entry from the manifest so @vercel/next
 * skips `getNodeMiddleware()` and instead uses `getMiddlewareBundle()`
 * which correctly handles Edge middleware via `middleware-manifest.json`.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const manifestPath = join(
  process.cwd(),
  ".next",
  "server",
  "functions-config-manifest.json"
);

if (!existsSync(manifestPath)) {
  console.log("functions-config-manifest.json not found, skipping");
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

if (manifest.functions?.["/_middleware"]) {
  delete manifest.functions["/_middleware"];
  writeFileSync(manifestPath, JSON.stringify(manifest));
  console.log("Removed /_middleware from functions-config-manifest.json");
} else {
  console.log("No /_middleware entry found, nothing to do");
}
