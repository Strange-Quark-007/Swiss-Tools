import { useMode as initMode, modeRgb, modeHsl, modeOklch, type Hsl } from 'culori/fn';

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
