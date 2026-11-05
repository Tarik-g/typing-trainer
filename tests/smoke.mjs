import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "core.js",
  "app.js",
  "sw.js",
  "manifest.webmanifest",
  "assets/icon.svg",
];

const contents = Object.fromEntries(
  await Promise.all(requiredFiles.map(async (file) => [file, await readFile(file, "utf8")])),
);

const manifest = JSON.parse(contents["manifest.webmanifest"]);
const iconFiles = ["assets/icon-192.png", "assets/icon-512.png", "assets/apple-touch-icon.png"];

await Promise.all(iconFiles.map((file) => access(file)));

assert.equal(manifest.start_url, "./#practice", "PWA start URL must stay relative for GitHub Pages");
assert.equal(manifest.scope, "./", "PWA scope must stay relative for GitHub Pages");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.background_color, "#ffffff");
assert.equal("display_override" in manifest, false);
assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192" && icon.type === "image/png"));
assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512" && icon.type === "image/png"));
assert.match(contents["index.html"], /href="\.\/manifest\.webmanifest"/u);
assert.match(contents["index.html"], /rel="apple-touch-icon"/u);
assert.match(contents["index.html"], /src="\.\/app\.js\?v=\d+"/u);
assert.match(contents["index.html"], /QWERTZ/u);
assert.match(contents["index.html"], /id="exercise-select"/u);
assert.match(contents["styles.css"], /#1a1b26/u, "Tokyo Night background token is missing");
assert.match(contents["sw.js"], /\.\/index\.html/u);

for (const exerciseId of [
  "numpy-array-analysis",
  "pandas-groupby",
  "pytorch-network",
  "sklearn-pipeline",
  "matplotlib-line-chart",
  "requests-get-json",
  "fastapi-query-route",
]) {
  assert.match(contents["app.js"], new RegExp(`id: "${exerciseId}"`, "u"), `${exerciseId} exercise is missing`);
}

const htmlReferences = [...contents["index.html"].matchAll(/(?:src|href)="(\.\/[^"#]+)"/gu)].map((match) => match[1]);
const appFilesBlock = contents["sw.js"].match(/const APP_FILES = \[([\s\S]*?)\];/u)?.[1] || "";
const cachedReferences = [...appFilesBlock.matchAll(/"([^"]+)"/gu)].map((match) => match[1]);

assert.ok(
  contents["index.html"].indexOf("./core.js") < contents["index.html"].indexOf("./app.js"),
  "core.js must load before app.js",
);

for (const reference of htmlReferences) {
  assert.ok(cachedReferences.includes(reference), `${reference} must be precached for offline use`);
  await access(reference.replace(/^\.\//u, "").split("?")[0]);
}

for (const asset of ["styles.css", "core.js", "app.js", "manifest.webmanifest", "assets/icon.svg"]) {
  assert.ok(!contents["index.html"].includes(`="/${asset}`), `${asset} must not use a root-absolute URL`);
}

console.log("Static smoke checks passed.");
