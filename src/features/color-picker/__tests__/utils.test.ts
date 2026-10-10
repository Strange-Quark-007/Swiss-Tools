import { type Hsl } from 'culori/fn';
import { describe, it, expect } from 'vitest';

import { convertColor, formatNum, hslToUi, hslUiToNormalized } from '../utils';

describe('color-picker utils', () => {
  describe('hslUiToNormalized', () => {
    it('should convert UI values (0-100 for s and l) to normalized 0-1 values', () => {
      const normalized = hslUiToNormalized({
        h: 210,
        s: 50,
        l: 60,
        alpha: 0.8,
      });

      expect(normalized).toEqual({
        mode: 'hsl',
        h: 210,
        s: 0.5,
        l: 0.6,
        alpha: 0.8,
      });
    });

    it('should handle boundary values for min and max bounds', () => {
      const min = hslUiToNormalized({
        h: 0,
        s: 0,
        l: 0,
        alpha: 0,
      });

      expect(min).toEqual({
        mode: 'hsl',
        h: 0,
        s: 0,
        l: 0,
        alpha: 0,
      });

      const max = hslUiToNormalized({
        h: 360,
        s: 100,
        l: 100,
        alpha: 1,
      });

      expect(max).toEqual({
        mode: 'hsl',
        h: 360,
        s: 1,
        l: 1,
        alpha: 1,
      });
    });

    it('should handle fractional percentages correctly', () => {
      const normalized = hslUiToNormalized({
        h: 120.5,
        s: 33.3,
        l: 66.7,
        alpha: 0.5,
      });

      expect(normalized.mode).toBe('hsl');
      expect(normalized.h).toBe(120.5);
      expect(normalized.s).toBeCloseTo(0.333, 4);
      expect(normalized.l).toBeCloseTo(0.667, 4);
      expect(normalized.alpha).toBe(0.5);
    });
  });

  describe('hslToUi', () => {
    it('should convert normalized Hsl to UI values scaled to 100', () => {
      const uiValues = hslToUi({
        mode: 'hsl',
        h: 210,
        s: 0.5,
        l: 0.6,
        alpha: 0.8,
      });

      expect(uiValues).toEqual({
        h: 210,
        s: 50,
        l: 60,
        alpha: 80,
      });
    });

    it('should fallback to default 0 values when color is undefined', () => {
      const uiValues = hslToUi(undefined);

      expect(uiValues).toEqual({
        h: undefined,
        s: 0,
        l: 0,
        alpha: 0,
      });
    });

    it('should fallback to 0 for missing channels on partial color object', () => {
      const uiValues = hslToUi({
        mode: 'hsl',
        h: 180,
      } as Hsl);

      expect(uiValues).toEqual({
        h: 180,
        s: 0,
        l: 0,
        alpha: 0,
      });
    });

    it('should scale 1.0 alpha to 100', () => {
      const uiValues = hslToUi({
        mode: 'hsl',
        h: 0,
        s: 1,
        l: 0.5,
        alpha: 1,
      });

      expect(uiValues).toEqual({
        h: 0,
        s: 100,
        l: 50,
        alpha: 100,
      });
    });
  });

  describe('formatNum', () => {
    it('should format numbers to default 2 decimal places', () => {
      expect(formatNum(12.3456)).toBe(12.35);
      expect(formatNum(12.3)).toBe(12.3);
      expect(formatNum(12)).toBe(12);
      expect(formatNum(0)).toBe(0);
    });

    it('should format numbers to specified decimal places', () => {
      expect(formatNum(12.3456, 0)).toBe(12);
      expect(formatNum(12.3456, 1)).toBe(12.3);
      expect(formatNum(12.3456, 3)).toBe(12.346);
      expect(formatNum(12.3456, 4)).toBe(12.3456);
    });

    it('should return 0 when input number is undefined', () => {
      expect(formatNum(undefined)).toBe(0);
      expect(formatNum(undefined, 3)).toBe(0);
    });

    it('should handle negative numbers properly', () => {
      expect(formatNum(-5.6789)).toBe(-5.68);
      expect(formatNum(-0.1234, 1)).toBe(-0.1);
    });
  });

  describe('convertColor', () => {
    it('should convert pure red HSL color to rgb, hsl, and oklch', () => {
      const input: Hsl = {
        mode: 'hsl',
        h: 0,
        s: 1,
        l: 0.5,
        alpha: 1,
      };

      const result = convertColor(input);

      expect(result.rgb.mode).toBe('rgb');
      expect(result.rgb.r).toBe(1);
      expect(result.rgb.g).toBe(0);
      expect(result.rgb.b).toBe(0);
      expect(result.rgb.alpha).toBe(1);

      expect(result.hsl.mode).toBe('hsl');
      expect(result.hsl.h).toBe(0);
      expect(result.hsl.s).toBe(1);
      expect(result.hsl.l).toBe(0.5);

      expect(result.oklch.mode).toBe('oklch');
      expect(result.oklch.l).toBeGreaterThan(0);
      expect(result.oklch.c).toBeGreaterThan(0);
      expect(result.oklch.alpha).toBe(1);
    });

    it('should convert pure green and blue HSL colors accurately', () => {
      const greenInput: Hsl = { mode: 'hsl', h: 120, s: 1, l: 0.5 };
      const greenResult = convertColor(greenInput);
      expect(greenResult.rgb.r).toBe(0);
      expect(greenResult.rgb.g).toBe(1);
      expect(greenResult.rgb.b).toBe(0);

      const blueInput: Hsl = { mode: 'hsl', h: 240, s: 1, l: 0.5 };
      const blueResult = convertColor(blueInput);
      expect(blueResult.rgb.r).toBe(0);
      expect(blueResult.rgb.g).toBe(0);
      expect(blueResult.rgb.b).toBe(1);
    });

    it('should convert black and white colors', () => {
      const whiteInput: Hsl = { mode: 'hsl', h: 0, s: 0, l: 1 };
      const whiteResult = convertColor(whiteInput);
      expect(whiteResult.rgb.r).toBe(1);
      expect(whiteResult.rgb.g).toBe(1);
      expect(whiteResult.rgb.b).toBe(1);

      const blackInput: Hsl = { mode: 'hsl', h: 0, s: 0, l: 0 };
      const blackResult = convertColor(blackInput);
      expect(blackResult.rgb.r).toBe(0);
      expect(blackResult.rgb.g).toBe(0);
      expect(blackResult.rgb.b).toBe(0);
    });

    it('should preserve alpha transparency across conversions', () => {
      const transparentInput: Hsl = {
        mode: 'hsl',
        h: 180,
        s: 0.5,
        l: 0.5,
        alpha: 0.35,
      };

      const result = convertColor(transparentInput);

      expect(result.rgb.alpha).toBe(0.35);
      expect(result.hsl.alpha).toBe(0.35);
      expect(result.oklch.alpha).toBe(0.35);
    });
  });
});
