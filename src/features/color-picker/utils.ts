import { parse } from 'culori';
import { formatHex8, type Hsl, useMode as initMode, modeHsl, modeOklch, modeRgb } from 'culori/fn';

const toRgb = initMode(modeRgb);
const toHsl = initMode(modeHsl);
const toOklch = initMode(modeOklch);

interface HSLUI {
  h: number;
  s: number;
  l: number;
  alpha: number;
}

export const hslUiToNormalized = (color: HSLUI): Hsl => ({
  mode: 'hsl',
  h: color.h,
  s: color.s / 100,
  l: color.l / 100,
  alpha: color.alpha,
});

export const hslToUi = (color?: Hsl) => {
  const { h, s, l, alpha } = color || {};
  return {
    h,
    s: (s ?? 0) * 100,
    l: (l ?? 0) * 100,
    alpha: (alpha ?? 0) * 100,
  };
};

export const formatNum = (n?: number, d = 2) => Number.parseFloat((n ?? 0).toFixed(d));

export const convertColor = (color: Hsl) => {
  const rgb = toRgb(color);
  const hsl = toHsl(color);
  const oklch = toOklch(color);

  return { rgb, hsl, oklch };
};

/**
 * Parses a CSS color string into HSL. Returns `undefined` when the value is not a valid color.
 */
export const parseColor = (value: string): Hsl | undefined => {
  const parsed = parse(value);

  return parsed ? toHsl(parsed) : undefined;
};

/**
 * Formats a color as an 8-digit hex string, including alpha.
 */
export const formatSwatch = (color: Hsl): string => formatHex8(toRgb(color));

/**
 * Formats a color for the editable color field: 6-digit hex when opaque,
 * 8-digit hex when the color carries transparency.
 */
export const formatColorInput = (color: Hsl): string => {
  const hex = formatHex8(toRgb(color));

  return (color.alpha ?? 1) >= 1 ? hex.slice(0, 7) : hex;
};
