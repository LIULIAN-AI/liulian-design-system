#!/usr/bin/env node
/**
 * LIULIAN design-tokens build script.
 * Reads src/tokens.json and emits:
 *   dist/tokens.css            (CSS custom properties)
 *   dist/tokens.mjs            (ESM)
 *   dist/tokens.js             (CJS)
 *   dist/tokens.d.ts           (TS types)
 *   dist/tokens.rn.js          (React Native StyleSheet object)
 *   dist/tailwind.preset.js    (Tailwind preset)
 *   dist/antd-theme.js         (Ant Design ConfigProvider theme)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
mkdirSync(DIST, { recursive: true });

const tokens = JSON.parse(readFileSync(join(ROOT, 'src/tokens.json'), 'utf8'));

// Walk tokens, collecting leaf {path, value} pairs.
function walk(obj, prefix = []) {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    const path = [...prefix, k];
    if (v && typeof v === 'object' && 'value' in v) {
      out.push({ path, value: v.value, description: v.$description });
    } else if (v && typeof v === 'object') {
      out.push(...walk(v, path));
    }
  }
  return out;
}
const leaves = walk(tokens);

// Helper to make a CSS-safe variable name from a path array.
const cssVar = (path) =>
  '--' + path.join('-').replace(/DEFAULT$/, '').replace(/-$/, '').toLowerCase();

// ---- tokens.css ----
const cssLines = [
  '/* AUTO-GENERATED from src/tokens.json by scripts/build.mjs — DO NOT EDIT. */',
  ':root {',
];
for (const { path, value, description } of leaves) {
  const v = Array.isArray(value) ? value.join(', ') : value;
  if (description) cssLines.push(`  /* ${description} */`);
  cssLines.push(`  ${cssVar(path)}: ${v};`);
}
cssLines.push('}');
writeFileSync(join(DIST, 'tokens.css'), cssLines.join('\n') + '\n');

// ---- tokens.mjs / .js ----
const flat = Object.fromEntries(
  leaves.map(({ path, value }) => [path.join('.'), value])
);
const esm = `/* AUTO-GENERATED */
export const tokens = ${JSON.stringify(flat, null, 2)};
export default tokens;
`;
writeFileSync(join(DIST, 'tokens.mjs'), esm);
writeFileSync(
  join(DIST, 'tokens.js'),
  '/* AUTO-GENERATED */\n' +
    `const tokens = ${JSON.stringify(flat, null, 2)};\n` +
    'module.exports = tokens;\nmodule.exports.tokens = tokens;\n'
);

// ---- tokens.d.ts ----
const dts =
  '/* AUTO-GENERATED */\n' +
  `export declare const tokens: ${JSON.stringify(
    Object.fromEntries(Object.keys(flat).map((k) => [k, 'string'])),
    null,
    2
  ).replace(/"string"/g, 'string')};\nexport default tokens;\n`;
writeFileSync(join(DIST, 'tokens.d.ts'), dts);

// ---- tokens.rn.js (React Native StyleSheet object) ----
const rn = `/* AUTO-GENERATED React Native style tokens. */
export const colors = {
${leaves
  .filter(({ path }) => path[0] === 'color')
  .map(({ path, value }) => `  ${path.slice(1).join('_').replace(/-/g, '_')}: ${JSON.stringify(value)},`)
  .join('\n')}
};
export const fonts = {
${leaves
  .filter(({ path }) => path[0] === 'font')
  .map(({ path, value }) => `  ${path[1]}: ${JSON.stringify(Array.isArray(value) ? value : [value])},`)
  .join('\n')}
};
export const spacing = ${JSON.stringify(
  Object.fromEntries(
    leaves.filter(({ path }) => path[0] === 'spacing').map(({ path, value }) => [path[1], value])
  ),
  null,
  2
)};
export const radius = ${JSON.stringify(
  Object.fromEntries(
    leaves.filter(({ path }) => path[0] === 'radius').map(({ path, value }) => [path[1], value])
  ),
  null,
  2
)};
export default { colors, fonts, spacing, radius };
`;
writeFileSync(join(DIST, 'tokens.rn.js'), rn);

// ---- tailwind.preset.js ----
const tailwindColors = {};
for (const { path, value } of leaves.filter(({ path }) => path[0] === 'color')) {
  const ns = path[1];
  const variant = path.slice(2).join('-') || 'DEFAULT';
  tailwindColors[ns] = tailwindColors[ns] || {};
  tailwindColors[ns][variant.toLowerCase()] = value;
}
const preset = `/* AUTO-GENERATED Tailwind preset. */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(tailwindColors, null, 2)},
      fontFamily: ${JSON.stringify(
        Object.fromEntries(
          leaves.filter(({ path }) => path[0] === 'font').map(({ path, value }) => [path[1], value])
        ),
        null,
        2
      )},
      fontSize: ${JSON.stringify(
        Object.fromEntries(
          leaves.filter(({ path }) => path[0] === 'fontSize').map(({ path, value }) => [path[1], value])
        ),
        null,
        2
      )},
      spacing: ${JSON.stringify(
        Object.fromEntries(
          leaves.filter(({ path }) => path[0] === 'spacing').map(({ path, value }) => [path[1], value])
        ),
        null,
        2
      )},
      borderRadius: ${JSON.stringify(
        Object.fromEntries(
          leaves.filter(({ path }) => path[0] === 'radius').map(({ path, value }) => [path[1], value])
        ),
        null,
        2
      )},
    },
  },
};
`;
writeFileSync(join(DIST, 'tailwind.preset.js'), preset);

// ---- antd-theme.js ----
const getC = (p) => leaves.find(({ path }) => path.join('.') === p)?.value;
const antd = `/* AUTO-GENERATED Ant Design ConfigProvider theme. */
module.exports = {
  token: {
    colorPrimary: ${JSON.stringify(getC('color.unibe-red.DEFAULT'))},
    colorBgBase: ${JSON.stringify(getC('color.canvas.warm'))},
    colorBgContainer: ${JSON.stringify(getC('color.surface.pure'))},
    colorTextBase: ${JSON.stringify(getC('color.ink.charcoal'))},
    colorTextSecondary: ${JSON.stringify(getC('color.ink.muted'))},
    colorBorder: ${JSON.stringify(getC('color.hairline.DEFAULT'))},
    colorBorderSecondary: ${JSON.stringify(getC('color.hairline.strong'))},
    fontFamily: ${JSON.stringify((getC('font.body') || []).join(', '))},
    fontFamilyCode: ${JSON.stringify((getC('font.mono') || []).join(', '))},
    borderRadius: 10,
    borderRadiusLG: 14,
    borderRadiusSM: 6,
    wireframe: false,
  },
  components: {
    Button: { borderRadius: 6, fontWeight: 500 },
    Card: { borderRadiusLG: 10, paddingLG: 24 },
    Input: { borderRadius: 6 },
    Select: { borderRadius: 6 },
    Table: { borderRadiusLG: 0, headerBg: ${JSON.stringify(getC('color.surface.shade'))} },
  },
};
`;
writeFileSync(join(DIST, 'antd-theme.js'), antd);

// =====================================================================
// Native platform emitters (Swift / Kotlin / ArkTS) + Figma DTCG export
// Added 2026-05-14 for liulian-mobile native foundation (feat branch).
// =====================================================================

function numericPart(v) {
  if (typeof v !== 'string') return Number(v);
  const m = v.match(/^([-+]?[0-9]*\.?[0-9]+)/);
  return m ? Number(m[1]) : NaN;
}

function parseCubicBezier(v) {
  if (typeof v !== 'string') return null;
  const m = v.match(/cubic-bezier\(([^)]+)\)/);
  return m ? m[1].split(',').map((s) => Number(s.trim())) : null;
}

function hexUInt(hex) {
  if (typeof hex !== 'string') return 0;
  return parseInt(hex.replace('#', ''), 16) >>> 0;
}

function pad6(n) {
  return n.toString(16).toUpperCase().padStart(6, '0');
}

function camelize(s) {
  return s.replace(/[-_]([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
}

function identFor(group, name) {
  if (name === 'DEFAULT') return '';
  let s;
  if (group === 'spacing') {
    s = /^[0-9]+$/.test(name) ? 's' + name : name;
  } else if (group === 'fontSize') {
    const m = name.match(/^([0-9])(xl)$/);
    s = m ? m[2] + m[1] : name;
  } else {
    s = /^[0-9]/.test(name) ? '_' + name : name;
  }
  return camelize(s);
}

function leafName(path, group) {
  const segs = path.slice(1).map((p) => identFor(group, p)).filter(Boolean);
  if (!segs.length) return identFor(group, path[1] || '_unnamed') || '_unnamed';
  return (
    segs[0] +
    segs
      .slice(1)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
  );
}

const grouped = {};
for (const l of leaves) {
  (grouped[l.path[0]] ||= []).push(l);
}

// ---- Tokens.swift (iOS / SwiftUI) ----
{
  const out = [
    '// AUTO-GENERATED from src/tokens.json — DO NOT EDIT.',
    '// SwiftUI tokens for LiulianUI. Built by liulian-design-system/scripts/build.mjs.',
    '',
    'import Foundation',
    'import SwiftUI',
    '',
    'public enum LiulianTokens {',
  ];

  if (grouped.color) {
    out.push('    public enum Colors {');
    for (const { path, value, description } of grouped.color) {
      const ident = leafName(path, 'color');
      const hex = pad6(hexUInt(value));
      if (description) out.push(`        /// ${description}`);
      out.push(`        public static let ${ident}: Color = Color(hex: 0x${hex})`);
    }
    out.push('    }', '');
  }

  if (grouped.font) {
    out.push('    public enum Fonts {');
    for (const { path, value } of grouped.font) {
      const ident = leafName(path, 'font');
      const primary = Array.isArray(value) ? value[0] : value;
      out.push(`        public static let ${ident}: String = ${JSON.stringify(primary)}`);
      if (Array.isArray(value)) {
        out.push(`        public static let ${ident}Stack: [String] = ${JSON.stringify(value)}`);
      }
    }
    out.push('    }', '');
  }

  if (grouped.fontSize) {
    out.push('    public enum FontSize {');
    for (const { path, value } of grouped.fontSize) {
      const ident = leafName(path, 'fontSize');
      out.push(`        public static let ${ident}: CGFloat = ${numericPart(value)}`);
    }
    out.push('    }', '');
  }

  if (grouped.spacing) {
    out.push('    public enum Spacing {');
    for (const { path, value } of grouped.spacing) {
      const ident = leafName(path, 'spacing');
      out.push(`        public static let ${ident}: CGFloat = ${numericPart(value)}`);
    }
    out.push('    }', '');
  }

  if (grouped.radius) {
    out.push('    public enum Radius {');
    for (const { path, value } of grouped.radius) {
      const ident = leafName(path, 'radius');
      out.push(`        public static let ${ident}: CGFloat = ${numericPart(value)}`);
    }
    out.push('    }', '');
  }

  if (grouped.control) {
    out.push('    public enum Control {');
    const byCat = {};
    for (const l of grouped.control) {
      (byCat[l.path[1]] ||= []).push(l);
    }
    for (const [cat, items] of Object.entries(byCat)) {
      const enumName = cat.charAt(0).toUpperCase() + camelize(cat.slice(1));
      out.push(`        public enum ${enumName} {`);
      for (const { path, value } of items) {
        const last = path[2] === 'DEFAULT' ? 'value' : identFor('control', path[2]);
        out.push(`            public static let ${last}: CGFloat = ${numericPart(value)}`);
      }
      out.push('        }');
    }
    out.push('    }', '');
  }

  if (grouped.focus) {
    out.push('    public enum Focus {');
    for (const { path, value } of grouped.focus) {
      const ident = leafName(path, 'focus');
      out.push(`        public static let ${ident}: CGFloat = ${numericPart(value)}`);
    }
    out.push('    }', '');
  }

  if (grouped.opacity) {
    out.push('    public enum Opacity {');
    for (const { path, value } of grouped.opacity) {
      const ident = leafName(path, 'opacity');
      out.push(`        public static let ${ident}: Double = ${numericPart(value)}`);
    }
    out.push('    }', '');
  }

  if (grouped.touch) {
    out.push('    public enum Touch {');
    for (const { path, value } of grouped.touch) {
      const ident = leafName(path, 'touch');
      out.push(`        public static let ${ident}: CGFloat = ${numericPart(value)}`);
    }
    out.push('    }', '');
  }

  if (grouped.motion) {
    const durations = grouped.motion.filter((l) => l.path[1].startsWith('duration'));
    const easings = grouped.motion.filter((l) => l.path[1].startsWith('ease'));
    if (durations.length) {
      out.push('    public enum Duration {');
      for (const { path, value } of durations) {
        const name = camelize(path[1].replace(/^duration-/, ''));
        out.push(`        public static let ${name}: Double = ${(numericPart(value) / 1000).toFixed(3)}`);
      }
      out.push('    }', '');
    }
    if (easings.length) {
      out.push('    public enum Easing {');
      for (const { path, value } of easings) {
        const name = camelize(path[1]);
        const bez = parseCubicBezier(value);
        if (bez) {
          out.push(`        public static let ${name}: (Double, Double, Double, Double) = (${bez.join(', ')})`);
        }
      }
      out.push('    }', '');
    }
  }

  out.push('}');
  out.push('');
  out.push('// Color from 0xRRGGBB hex literal');
  out.push('public extension Color {');
  out.push('    init(hex: UInt32, opacity: Double = 1.0) {');
  out.push('        let r = Double((hex >> 16) & 0xFF) / 255.0');
  out.push('        let g = Double((hex >> 8) & 0xFF) / 255.0');
  out.push('        let b = Double(hex & 0xFF) / 255.0');
  out.push('        self.init(red: r, green: g, blue: b, opacity: opacity)');
  out.push('    }');
  out.push('}');

  writeFileSync(join(DIST, 'Tokens.swift'), out.join('\n') + '\n');
}

// ---- Tokens.kt (Android / Jetpack Compose) ----
{
  const out = [
    '// AUTO-GENERATED from src/tokens.json — DO NOT EDIT.',
    '// Jetpack Compose tokens for liulian-ui (Android). Built by liulian-design-system/scripts/build.mjs.',
    '',
    'package io.liulian.tokens',
    '',
    'import androidx.compose.animation.core.CubicBezierEasing',
    'import androidx.compose.ui.graphics.Color',
    'import androidx.compose.ui.unit.dp',
    'import androidx.compose.ui.unit.sp',
    '',
    'object LiulianTokens {',
  ];

  if (grouped.color) {
    out.push('    object Colors {');
    for (const { path, value, description } of grouped.color) {
      const ident = leafName(path, 'color');
      const hex = pad6(hexUInt(value));
      if (description) out.push(`        /** ${description} */`);
      out.push(`        val ${ident} = Color(0xFF${hex}.toInt())`);
    }
    out.push('    }', '');
  }

  if (grouped.font) {
    out.push('    object Fonts {');
    for (const { path, value } of grouped.font) {
      const ident = leafName(path, 'font');
      const primary = Array.isArray(value) ? value[0] : value;
      out.push(`        const val ${ident} = ${JSON.stringify(primary)}`);
    }
    out.push('    }', '');
  }

  if (grouped.fontSize) {
    out.push('    object FontSize {');
    for (const { path, value } of grouped.fontSize) {
      const ident = leafName(path, 'fontSize');
      out.push(`        val ${ident} = ${numericPart(value)}.sp`);
    }
    out.push('    }', '');
  }

  if (grouped.spacing) {
    out.push('    object Spacing {');
    for (const { path, value } of grouped.spacing) {
      const ident = leafName(path, 'spacing');
      out.push(`        val ${ident} = ${numericPart(value)}.dp`);
    }
    out.push('    }', '');
  }

  if (grouped.radius) {
    out.push('    object Radius {');
    for (const { path, value } of grouped.radius) {
      const ident = leafName(path, 'radius');
      out.push(`        val ${ident} = ${numericPart(value)}.dp`);
    }
    out.push('    }', '');
  }

  if (grouped.control) {
    out.push('    object Control {');
    const byCat = {};
    for (const l of grouped.control) {
      (byCat[l.path[1]] ||= []).push(l);
    }
    for (const [cat, items] of Object.entries(byCat)) {
      const objName = cat.charAt(0).toUpperCase() + camelize(cat.slice(1));
      out.push(`        object ${objName} {`);
      for (const { path, value } of items) {
        const last = path[2] === 'DEFAULT' ? 'value' : identFor('control', path[2]);
        const num = numericPart(value);
        // scaleActive is a unitless number; the rest are dp
        if (cat === 'scaleActive') {
          out.push(`            const val ${last} = ${num}f`);
        } else {
          out.push(`            val ${last} = ${num}.dp`);
        }
      }
      out.push('        }');
    }
    out.push('    }', '');
  }

  if (grouped.focus) {
    out.push('    object Focus {');
    for (const { path, value } of grouped.focus) {
      const ident = leafName(path, 'focus');
      out.push(`        val ${ident} = ${numericPart(value)}.dp`);
    }
    out.push('    }', '');
  }

  if (grouped.opacity) {
    out.push('    object Opacity {');
    for (const { path, value } of grouped.opacity) {
      const ident = leafName(path, 'opacity');
      out.push(`        const val ${ident} = ${numericPart(value)}f`);
    }
    out.push('    }', '');
  }

  if (grouped.touch) {
    out.push('    object Touch {');
    for (const { path, value } of grouped.touch) {
      const ident = leafName(path, 'touch');
      out.push(`        val ${ident} = ${numericPart(value)}.dp`);
    }
    out.push('    }', '');
  }

  if (grouped.motion) {
    const durations = grouped.motion.filter((l) => l.path[1].startsWith('duration'));
    const easings = grouped.motion.filter((l) => l.path[1].startsWith('ease'));
    if (durations.length) {
      out.push('    object Duration {');
      for (const { path, value } of durations) {
        const name = camelize(path[1].replace(/^duration-/, ''));
        out.push(`        const val ${name}: Int = ${numericPart(value)}`);
      }
      out.push('    }', '');
    }
    if (easings.length) {
      out.push('    object Easing {');
      for (const { path, value } of easings) {
        const name = camelize(path[1]);
        const bez = parseCubicBezier(value);
        if (bez) {
          out.push(`        val ${name} = CubicBezierEasing(${bez.map((n) => n + 'f').join(', ')})`);
        }
      }
      out.push('    }', '');
    }
  }

  out.push('}');

  writeFileSync(join(DIST, 'Tokens.kt'), out.join('\n') + '\n');
}

// ---- tokens.ets (HarmonyOS / ArkUI / ArkTS) ----
{
  const out = [
    '// AUTO-GENERATED from src/tokens.json — DO NOT EDIT.',
    '// ArkTS tokens for liulian_ui (HarmonyOS). Built by liulian-design-system/scripts/build.mjs.',
    '',
  ];

  const writeObject = (name, items, valueFn) => {
    out.push(`export const ${name} = {`);
    for (const item of items) {
      out.push(`  ${item.key}: ${valueFn(item.value)},`);
    }
    out.push('} as const');
    out.push('');
  };

  if (grouped.color) {
    const items = grouped.color.map(({ path, value }) => ({
      key: leafName(path, 'color'),
      value: JSON.stringify(value),
    }));
    out.push('export const Colors = {');
    for (const item of items) {
      out.push(`  ${item.key}: ${item.value},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.font) {
    out.push('export const Fonts = {');
    for (const { path, value } of grouped.font) {
      const ident = leafName(path, 'font');
      const primary = Array.isArray(value) ? value[0] : value;
      out.push(`  ${ident}: ${JSON.stringify(primary)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.fontSize) {
    out.push('export const FontSize = {');
    for (const { path, value } of grouped.fontSize) {
      const ident = leafName(path, 'fontSize');
      out.push(`  ${ident}: ${numericPart(value)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.spacing) {
    out.push('export const Spacing = {');
    for (const { path, value } of grouped.spacing) {
      const ident = leafName(path, 'spacing');
      out.push(`  ${ident}: ${numericPart(value)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.radius) {
    out.push('export const Radius = {');
    for (const { path, value } of grouped.radius) {
      const ident = leafName(path, 'radius');
      out.push(`  ${ident}: ${numericPart(value)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.control) {
    out.push('export const Control = {');
    const byCat = {};
    for (const l of grouped.control) {
      (byCat[l.path[1]] ||= []).push(l);
    }
    for (const [cat, items] of Object.entries(byCat)) {
      const objName = cat.charAt(0).toUpperCase() + camelize(cat.slice(1));
      out.push(`  ${objName}: {`);
      for (const { path, value } of items) {
        const last = path[2] === 'DEFAULT' ? 'value' : identFor('control', path[2]);
        out.push(`    ${last}: ${numericPart(value)},`);
      }
      out.push('  },');
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.focus) {
    out.push('export const Focus = {');
    for (const { path, value } of grouped.focus) {
      out.push(`  ${leafName(path, 'focus')}: ${numericPart(value)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.opacity) {
    out.push('export const Opacity = {');
    for (const { path, value } of grouped.opacity) {
      out.push(`  ${leafName(path, 'opacity')}: ${numericPart(value)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.touch) {
    out.push('export const Touch = {');
    for (const { path, value } of grouped.touch) {
      out.push(`  ${leafName(path, 'touch')}: ${numericPart(value)},`);
    }
    out.push('} as const');
    out.push('');
  }

  if (grouped.motion) {
    const durations = grouped.motion.filter((l) => l.path[1].startsWith('duration'));
    const easings = grouped.motion.filter((l) => l.path[1].startsWith('ease'));
    if (durations.length) {
      out.push('export const Duration = {');
      for (const { path, value } of durations) {
        const name = camelize(path[1].replace(/^duration-/, ''));
        out.push(`  ${name}: ${numericPart(value)},`);
      }
      out.push('} as const');
      out.push('');
    }
    if (easings.length) {
      out.push('// ArkUI cubic-bezier coefficients. Use with curves.cubicBezierCurve(...).');
      out.push('export const Easing = {');
      for (const { path, value } of easings) {
        const name = camelize(path[1]);
        const bez = parseCubicBezier(value);
        if (bez) {
          out.push(`  ${name}: [${bez.join(', ')}],`);
        }
      }
      out.push('} as const');
      out.push('');
    }
  }

  writeFileSync(join(DIST, 'tokens.ets'), out.join('\n'));
}

// ---- tokens.figma.json (W3C DTCG, $value form — Tokens Studio for Figma) ----
{
  function toDTCG(node) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) return node;
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === '$schema' || k === '$comment') {
        out[k] = v;
        continue;
      }
      if (v && typeof v === 'object' && 'value' in v) {
        const copy = { ...v };
        copy.$value = copy.value;
        delete copy.value;
        out[k] = copy;
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        out[k] = toDTCG(v);
      } else {
        out[k] = v;
      }
    }
    return out;
  }
  const dtcg = toDTCG(tokens);
  writeFileSync(join(DIST, 'tokens.figma.json'), JSON.stringify(dtcg, null, 2) + '\n');
}

console.log(
  `✓ wrote ${leaves.length} tokens to dist/ — ${[
    'tokens.css',
    'tokens.mjs / .js / .d.ts',
    'tokens.rn.js',
    'tailwind.preset.js',
    'antd-theme.js',
    'Tokens.swift (iOS)',
    'Tokens.kt (Android)',
    'tokens.ets (HarmonyOS)',
    'tokens.figma.json (W3C DTCG)',
  ].join(', ')}`
);
