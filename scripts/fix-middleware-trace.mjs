/**
 * Workaround for Next.js 16 middleware deployment on Vercel.
 *
 * Next.js 16 compiles middleware as a Proxy rather than a traditional Edge
 * function, but Vercel's deployment step still expects the legacy
 * `.nft.json` trace file at `.next/server/middleware.js.nft.json`.
 *
 * This script creates the missing file after `next build` so that the
 * deployment can proceed.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const serverDir = join(process.cwd(), ".next", "server");
const traceFile = join(serverDir, "middleware.js.nft.json");

if (!existsSync(traceFile)) {
  mkdirSync(serverDir, { recursive: true });
  writeFileSync(traceFile, JSON.stringify({ version: 1, files: [] }));
  console.log("Created missing middleware.js.nft.json trace file");
}
