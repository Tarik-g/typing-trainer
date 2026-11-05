import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "sw.js",
  "manifest.webmanifest",
  "assets/icon.svg",
];

const contents = Object.fromEntries(
  await Promise.all(requiredFiles.map(async (file) => [file, await readFile(file, "utf8")])),
);

const manifest = JSON.parse(contents["manifest.webmanifest"]);

assert.equal(manifest.start_url, "./#practice", "PWA start URL must stay relative for GitHub Pages");
assert.equal(manifest.scope, "./", "PWA scope must stay relative for GitHub Pages");
assert.match(contents["index.html"], /href="\.\/manifest\.webmanifest"/u);
assert.match(contents["index.html"], /src="\.\/app\.js"/u);
assert.match(contents["app.js"], /isStandalone \? window\.localStorage : window\.sessionStorage/u);
assert.match(contents["index.html"], /QWERTZ/u);
assert.match(contents["styles.css"], /#1a1b26/u, "Tokyo Night background token is missing");
assert.match(contents["sw.js"], /\.\/index\.html/u);

for (const asset of ["styles.css", "app.js", "manifest.webmanifest", "assets/icon.svg"]) {
  assert.ok(!contents["index.html"].includes(`="/${asset}`), `${asset} must not use a root-absolute URL`);
}

console.log("Static smoke checks passed.");
