import { describe, it, expect } from 'vitest';

import { ROUTES } from '../routes';

describe('ROUTES', () => {
  it('should define expected path strings starting with /', () => {
    Object.values(ROUTES).forEach((route) => {
      expect(route).toMatch(/^\//);
    });
  });

  it('should define correct routes for root and static pages', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
    expect(ROUTES.PRIVACY).toBe('/privacy');
  });

  it('should define correct converter and tool paths', () => {
    expect(ROUTES.NUMBER_CONVERTER).toBe('/number-converter');
    expect(ROUTES.CASE_CONVERTER).toBe('/case-converter');
    expect(ROUTES.DATA_FORMAT_CONVERTER).toBe('/data-format-converter');
    expect(ROUTES.ENCODER_DECODER).toBe('/encoder-decoder');
    expect(ROUTES.HASH_GENERATOR).toBe('/hash-generator');
    expect(ROUTES.JWT_DECODER).toBe('/jwt-decoder');
    expect(ROUTES.LOREM_GENERATOR).toBe('/lorem-generator');
    expect(ROUTES.ID_GENERATOR).toBe('/id-generator');
    expect(ROUTES.COLOR_PICKER).toBe('/color-picker');
  });

  it('should define correct nested paths for unit converters', () => {
    expect(ROUTES.LENGTH_CONVERTER).toBe('/unit-converter/length');
    expect(ROUTES.AREA_CONVERTER).toBe('/unit-converter/area');
    expect(ROUTES.VOLUME_CONVERTER).toBe('/unit-converter/volume');
    expect(ROUTES.WEIGHT_CONVERTER).toBe('/unit-converter/weight');
    expect(ROUTES.TEMPERATURE_CONVERTER).toBe('/unit-converter/temperature');
    expect(ROUTES.TIME_CONVERTER).toBe('/unit-converter/time');
    expect(ROUTES.SPEED_CONVERTER).toBe('/unit-converter/speed');
    expect(ROUTES.DATA_SIZE_CONVERTER).toBe('/unit-converter/data-size');
  });
});
