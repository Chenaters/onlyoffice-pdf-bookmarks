const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const pluginRoot = path.join(projectRoot, "pdf-bookmarks");

test("includes required marketplace metadata", () => {
  const config = JSON.parse(fs.readFileSync(path.join(pluginRoot, "config.json"), "utf8"));
  const variation = config.variations[0];

  assert.equal(config.offered, "Chenaters");
  assert.match(config.help, /^https:\/\/github\.com\/Chenaters\//);
  assert.deepEqual(variation.store.categories, ["work"]);
  assert.equal(variation.store.icons.light, "resources/store/icons");
  assert.equal(variation.store.icons.dark, "resources/store/icons");
  assert.equal(variation.store.screenshots.length, 3);
});

test("ships marketplace documentation and assets", () => {
  for (const fileName of ["README.md", "CHANGELOG.md", "LICENSE"]) {
    assert.equal(fs.existsSync(path.join(pluginRoot, fileName)), true, `${fileName} is missing`);
  }

  for (const fileName of [
    "icon.png",
    "icon@1.25x.png",
    "icon@1.5x.png",
    "icon@1.75x.png",
    "icon@2x.png",
    "icon.svg"
  ]) {
    assert.equal(
      fs.existsSync(path.join(pluginRoot, "resources", "store", "icons", fileName)),
      true,
      `Marketplace ${fileName} is missing`
    );
  }

  for (const fileName of ["screen_1.png", "screen_2.png", "screen_3.png"]) {
    assert.equal(
      fs.existsSync(path.join(pluginRoot, "resources", "store", "screenshots", fileName)),
      true,
      `Marketplace ${fileName} is missing`
    );
  }
});

test("production source contains no debug statements or external runtime URLs", () => {
  const sourceFiles = ["index.html", "plugin.js", "bookmarks-store.js"];

  for (const fileName of sourceFiles) {
    const source = fs.readFileSync(path.join(pluginRoot, fileName), "utf8");
    assert.doesNotMatch(source, /\bdebugger\b|console\.(?:log|debug|table)\s*\(/);
    assert.doesNotMatch(source, /https?:\/\//);
  }
});
