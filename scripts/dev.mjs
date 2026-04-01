#!/usr/bin/env node
/**
 * Starts `next dev` on the first free port in 3000–3009 so a busy :3000
 * doesn't block the app from running.
 */
import net from "node:net";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

function portFree(port) {
  return new Promise((resolve) => {
    const s = net.createServer();
    s.once("error", () => resolve(false));
    // Match Next’s default bind (all interfaces on :: / dual-stack), not 127.0.0.1-only
    s.listen(port, () => {
      s.close(() => resolve(true));
    });
  });
}

async function pickPort() {
  for (let p = 3000; p < 3010; p++) {
    if (await portFree(p)) return p;
  }
  throw new Error("No free port found in range 3000–3009");
}

const port = await pickPort();
const url = `http://localhost:${port}`;
console.log("\n  ▲ Portfolio dev server");
console.log(`  ▲ Local:        ${url}`);
console.log("");

const child = spawn(process.execPath, [nextBin, "dev", "-p", String(port)], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
