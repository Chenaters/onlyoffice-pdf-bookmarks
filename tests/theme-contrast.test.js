const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(projectRoot, "pdf-bookmarks", "styles.css"), "utf8");
const plugin = fs.readFileSync(path.join(projectRoot, "pdf-bookmarks", "plugin.js"), "utf8");

function declarationsFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `Missing CSS declarations for ${selector}`);

  return Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{6})\s*;/gi)]
      .map((entry) => [entry[1], entry[2].toLowerCase()])
  );
}

function relativeLuminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => parseInt(value, 16) / 255);
  const linear = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

function assertReadable(palette, foregroundName, backgroundName) {
  const ratio = contrastRatio(palette[foregroundName], palette[backgroundName]);
  assert.ok(
    ratio >= 4.5,
    `${foregroundName} on ${backgroundName} has contrast ${ratio.toFixed(2)}; expected at least 4.5`
  );
}

test("light and dark text palettes meet WCAG AA contrast", () => {
  for (const palette of [declarationsFor(":root"), declarationsFor(':root[data-theme="dark"]')]) {
    assertReadable(palette, "--text", "--panel-bg");
    assertReadable(palette, "--text", "--surface-raised");
    assertReadable(palette, "--muted", "--panel-bg");
    assertReadable(palette, "--muted", "--surface-raised");
    assertReadable(palette, "--accent-text", "--accent");
    assertReadable(palette, "--disabled-text", "--disabled-bg");
    assertReadable(palette, "--danger", "--panel-bg");
  }
});

test("ONLYOFFICE theme events map dark and contrast-dark to the dark palette", () => {
  assert.match(plugin, /themeType === "dark" \|\| themeType === "contrast-dark"/);
  assert.match(plugin, /root\.dataset\.theme = isDark \? "dark" : "light"/);
  assert.match(plugin, /onThemeChangedBase\(theme\)/);
  assert.match(plugin, /window\.Asc\.plugin\.onThemeChanged = applyTheme/);
});
