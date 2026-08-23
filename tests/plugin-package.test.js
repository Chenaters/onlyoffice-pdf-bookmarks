const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const pluginRoot = path.join(projectRoot, "pdf-bookmarks");

function readPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = buffer.subarray(0, 8).toString("hex");
  assert.equal(signature, "89504e470d0a1a0a", `${filePath} is not a PNG file`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

test("uses the visible left sidebar panel with scale-aware PNG icons", () => {
  const config = JSON.parse(fs.readFileSync(path.join(pluginRoot, "config.json"), "utf8"));
  const variation = config.variations[0];

  assert.equal(variation.type, "panel");
  assert.equal(
    variation.icons,
    "resources/%theme-type%(light|dark)/icon%scale%(default).%extension%(png)"
  );
  assert.equal(variation.EditorsSupport.includes("pdf"), true);
  assert.equal(variation.isDisplayedInViewer, true);
});

test("ships correctly sized bookmark icons for every supported display scale", () => {
  const sizes = new Map([
    ["icon.png", 28],
    ["icon@1.25x.png", 35],
    ["icon@1.5x.png", 42],
    ["icon@1.75x.png", 49],
    ["icon@2x.png", 56]
  ]);

  for (const theme of ["light", "dark"]) {
    for (const [fileName, expectedSize] of sizes) {
      const dimensions = readPngDimensions(path.join(pluginRoot, "resources", theme, fileName));
      assert.deepEqual(dimensions, { width: expectedSize, height: expectedSize });
    }
  }
});

test("never displays the empty state beside saved bookmark rows", () => {
  const index = fs.readFileSync(path.join(pluginRoot, "index.html"), "utf8");
  const styles = fs.readFileSync(path.join(pluginRoot, "styles.css"), "utf8");
  const plugin = fs.readFileSync(path.join(pluginRoot, "plugin.js"), "utf8");

  assert.match(index, /id="empty-state" class="empty-state" hidden/);
  assert.match(index, /id="bookmark-list" class="bookmark-list" aria-live="polite" hidden/);
  assert.match(styles, /\[hidden\]\s*\{\s*display:\s*none\s*!important;/);
  assert.match(plugin, /elements\.empty\.hidden = !isEmpty/);
  assert.match(plugin, /elements\.list\.hidden = isEmpty/);
});
