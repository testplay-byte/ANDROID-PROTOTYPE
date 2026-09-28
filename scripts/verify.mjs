#!/usr/bin/env node
/**
 * scripts/verify.mjs — the pre-review gate.
 *
 * Opens every prototype headlessly at its supported surface sizes and fails on
 * the defect classes that no amount of eyeballing catches:
 *
 *   · horizontal overflow            (something is wider than its surface)
 *   · clipped content                (scrollHeight > clientHeight where the
 *                                     user cannot scroll to it)
 *   · forbidden in-surface CSS       (vh/vw units, fixed-px grid track minimums)
 *   · missing page                   (route 404 / build problem)
 *
 * Screenshots land in .verify/<name>-<width>.png for visual review.
 *
 *   node scripts/verify.mjs              # everything
 *   node scripts/verify.mjs atlas bloom  # only these
 *   node scripts/verify.mjs --no-shots   # checks only
 *
 * Requires a built site (npm run build) and a static server on PORT
 * (default 3001) serving the out/ folder under the repo's basePath — the
 * repo root's start-server.bat does exactly that.
 */

import { spawn } from "node:child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, ".verify");
const PORT = process.env.PORT ?? "3001";
const BASE = `http://localhost:${PORT}/ANDROID-PROTOTYPE`;
const SHOTS = !process.argv.includes("--no-shots");

/* ---------- discover prototypes from the dashboard's own data ---------- */
function discover() {
  const page = readFileSync(join(ROOT, "app", "page.tsx"), "utf8");
  const out = [];
  const re = /name:\s*"([^"]+)",\s*\r?\n\s*url:\s*"prototypes\/([^/"]+)\/"/g;
  let m;
  while ((m = re.exec(page))) out.push({ name: m[1], slug: m[2] });
  return out;
}

/* ---------- phone vs desktop size sets ---------- */
const PHONE_WIDTHS = [360, 390, 430];
const DESKTOP_WIDTHS = [1280, 1000, 760];

/* ---------- static CSS checks (no browser needed) ---------- */
function staticChecks(slug) {
  const problems = [];
  const files = [
    join(ROOT, "src", "prototypes", slug, `${slug}.css`),
    join(ROOT, "app", "prototypes", slug, "page.tsx"),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const src = readFileSync(file, "utf8");
    src.split("\n").forEach((line, i) => {
      const where = `${file.split("\\").pop()}:${i + 1}`;
      if (/\d(vh|vw)\b/.test(line) && !line.trim().startsWith("*") && !line.includes("dvh") && !line.includes("dvw")) {
        problems.push(`${where} viewport unit in surface content — use the frame, not the browser`);
      }
      const m = line.match(/minmax\(\s*(\d+)px\s*,/);
      if (m && /grid-(auto-rows|template-rows)/.test(line)) {
        problems.push(`${where} fixed-px grid track minimum (minmax(${m[1]}px, …)) — tracks never grow; use min-content + an item floor`);
      }
    });
  }
  return problems;
}

/* ---------- browser checks via headless Chrome + CDP ---------- */
async function cdp(url, width, height) {
  const chrome =
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const profile = join(tmpdir(), `verify-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const port = 9500 + Math.floor(Math.random() * 400);
  const child = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${port}`,
      `--window-size=${width},${height}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  try {
    // wait for the debugging endpoint
    let wsUrl = null;
    for (let i = 0; i < 50 && !wsUrl; i++) {
      await new Promise((r) => setTimeout(r, 120));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/json/version`);
        wsUrl = (await res.json()).webSocketDebuggerUrl;
      } catch {}
    }
    if (!wsUrl) throw new Error("chrome did not start");

    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });
    let id = 0;
    const pending = new Map();
    const events = [];
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result);
        pending.delete(msg.id);
      } else if (msg.method) events.push(msg);
    };
    const send = (method, params = {}, sessionId) =>
      new Promise((res) => {
        const msg = { id: ++id, method, params };
        if (sessionId) msg.sessionId = sessionId;
        pending.set(msg.id, res);
        ws.send(JSON.stringify(msg));
      });

    const { targetId } = await send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
    await send("Page.enable", {}, sessionId);
    await send("Runtime.enable", {}, sessionId);
    await send("Emulation.setDeviceMetricsOverride",
      { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send("Page.navigate", { url }, sessionId);
    await new Promise((r) => setTimeout(r, 2600));

    const { result } = await send(
      "Runtime.evaluate",
      {
        returnByValue: true,
        expression: `(() => {
          const frame = document.querySelector(".device, .surface");
          if (!frame) return { fatal: "no frame" };
          const fb = frame.getBoundingClientRect();
          const scroller = frame.querySelector(".screen, [class*='screen']");
          const out = {
            frame: { w: Math.round(fb.width), h: Math.round(fb.height) },
            viewport: window.innerWidth,
            overflowX: Math.max(0, Math.round(fb.right - window.innerWidth)),
            wide: [],
            clipped: [],
          };
          // Decorative bleed (background orbs, fields) and off-screen swipe
          // views are DESIGNED to sit outside their container — only flag an
          // element that escapes every clipping/scrolling ancestor up to the
          // frame, and only flag clipped text with no scrollable way out.
          const name = (el) => (el.className && el.className.baseVal !== undefined
            ? el.tagName.toLowerCase() + "." + el.className.baseVal
            : (el.className || el.tagName).toString().split(" ").join(".")).slice(0, 44);
          const contained = (el) => {
            for (let p = el.parentElement; p && p !== frame; p = p.parentElement) {
              const o = getComputedStyle(p);
              if (/hidden|clip|auto|scroll/.test(o.overflowX + o.overflowY)) return true;
            }
            return false;
          };
          for (const el of frame.querySelectorAll("*")) {
            const b = el.getBoundingClientRect();
            if (b.width === 0 || b.height === 0) continue;
            // the surface's own resize handles sit half outside the window on
            // purpose — they are chrome, not overflowing content
            if (el.getAttribute("role") === "separator" || el.hasAttribute("data-dir")) continue;
            const inside = contained(el);
            if (!inside && (b.right > fb.right + 1 || b.left < fb.left - 1)) {
              if (out.wide.length < 6)
                out.wide.push(name(el) + " [" + Math.round(b.left - fb.left) + "→" + Math.round(b.right - fb.left) + "]");
            }
            const cs = getComputedStyle(el);
            const scrollable = /auto|scroll/.test(cs.overflowX + cs.overflowY);
            const clips = /hidden|clip/.test(cs.overflowX + cs.overflowY);
            // an out-of-flow child (a dock that overhangs the frame edge, a
            // decorative bleed) is clipped on purpose — only IN-FLOW content
            // being cut off counts as a defect
            const outOfFlow = cs.position === "absolute" || cs.position === "fixed";
            if (clips && !scrollable && !contained(el) && !outOfFlow && el.scrollHeight > el.clientHeight + 2) {
              if (out.clipped.length < 6)
                out.clipped.push(name(el) + " " + el.scrollHeight + ">" + el.clientHeight);
            }
          }
          return out;
        })()`,
      },
      sessionId
    );

    let shot = null;
    if (SHOTS) {
      const { data } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
      shot = Buffer.from(data, "base64");
    }
    ws.close();
    return { page: result.value, shot };
  } finally {
    child.kill();
  }
}

/* ---------- run ---------- */
const all = discover();
const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = wanted.length ? all.filter((p) => wanted.includes(p.slug)) : all;
if (!targets.length) {
  console.error("No matching prototypes. Known:", all.map((p) => p.slug).join(", "));
  process.exit(1);
}
if (SHOTS) mkdirSync(OUT, { recursive: true });

let failures = 0;
console.log(`Verifying ${targets.length} prototype(s) against ${BASE}\n`);

for (const p of targets) {
  const issues = staticChecks(p.slug).map((s) => "static: " + s);
  // desktop prototypes get desktop widths; phone prototypes get phone widths
  const src = readFileSync(join(ROOT, "app", "page.tsx"), "utf8");
  const entry = src.slice(src.indexOf(`"${p.name}"`) - 200, src.indexOf(`"${p.name}"`) + 700);
  const isDesktop = /surfaces:\s*\[[^\]]*"desktop"/.test(entry);
  const widths = isDesktop ? DESKTOP_WIDTHS : PHONE_WIDTHS;
  process.stdout.write(`• ${p.name} (${isDesktop ? "desktop" : "phone"}) `);
  for (const w of widths) {
    try {
      // Chrome occasionally refuses to boot when instances are spawned back to
      // back; one retry keeps a flaky launch from reading as a layout failure.
      let page;
      let shot;
      try {
        ({ page, shot } = await cdp(`${BASE}/prototypes/${p.slug}/`, w, isDesktop ? 900 : 900));
      } catch (first) {
        await new Promise((r) => setTimeout(r, 900));
        ({ page, shot } = await cdp(`${BASE}/prototypes/${p.slug}/`, w, isDesktop ? 900 : 900));
      }
      if (shot) writeFileSync(join(OUT, `${p.slug}-${w}.png`), shot);
      if (!page || page.fatal) {
        issues.push(`${w}px: ${page?.fatal ?? "no result"}`);
        continue;
      }
      if (page.overflowX > 1) issues.push(`${w}px: horizontal overflow ${page.overflowX}px`);
      for (const el of page.wide ?? []) issues.push(`${w}px: out of frame — ${el}`);
      for (const el of page.clipped ?? []) issues.push(`${w}px: clipped — ${el}`);
      process.stdout.write("·");
    } catch (e) {
      issues.push(`${w}px: ${e.message}`);
    }
  }
  if (issues.length) {
    failures++;
    console.log(`\n  ✗ ${p.name}`);
    for (const i of [...new Set(issues)]) console.log("     " + i);
  } else {
    console.log("✓");
  }
}

console.log(
  failures
    ? `\n${failures} prototype(s) with issues. Screenshots in .verify/`
    : `\nAll ${targets.length} prototype(s) clean. Screenshots in .verify/`
);
process.exit(failures ? 1 : 0);
