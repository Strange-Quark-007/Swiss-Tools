import { describe, expect, it } from 'vitest';

import { ROUTES, ROUTES_WITHOUT_SIDEBAR, UNIT_CONVERTER_ROUTE } from '../routes';

describe('ROUTES', () => {
  it('should define UNIT_CONVERTER_ROUTE base constant', () => {
    expect(UNIT_CONVERTER_ROUTE).toBe('/unit-converter');
  });

  it('should define expected path strings starting with /', () => {
    Object.values(ROUTES).forEach((route) => {
      expect(route).toMatch(/^\//);
    });
  });

  it('should define correct routes for root and static pages', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
    expect(ROUTES.PRIVACY).toBe('/privacy');
    expect(ROUTES.PREFERENCES).toBe('/preferences');
    expect(ROUTES.LABS).toBe('/labs');
  });

  it('should define ROUTES_WITHOUT_SIDEBAR containing expected static routes', () => {
    expect(ROUTES_WITHOUT_SIDEBAR).toEqual([ROUTES.HOME, ROUTES.PRIVACY, ROUTES.PREFERENCES, ROUTES.LABS]);
  });

  it('should define correct converter and tool paths', () => {
    expect(ROUTES.NUMBER_CONVERTER).toBe('/number-converter');
    expect(ROUTES.TIMESTAMP_CONVERTER).toBe('/timestamp-converter');
    expect(ROUTES.CASE_CONVERTER).toBe('/case-converter');
    expect(ROUTES.DATA_FORMAT_CONVERTER).toBe('/data-format-converter');
    expect(ROUTES.ENCODER_DECODER).toBe('/encoder-decoder');
    expect(ROUTES.HASH_GENERATOR).toBe('/hash-generator');
    expect(ROUTES.JWT_DECODER).toBe('/jwt-decoder');
    expect(ROUTES.LOREM_GENERATOR).toBe('/lorem-generator');
    expect(ROUTES.ID_GENERATOR).toBe('/id-generator');
    expect(ROUTES.COLOR_PICKER).toBe('/color-picker');
    expect(ROUTES.REGEX_TESTER).toBe('/regex-tester');
  });

  it('should define correct nested paths for unit converters', () => {
    expect(ROUTES.LENGTH_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/length`);
    expect(ROUTES.AREA_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/area`);
    expect(ROUTES.VOLUME_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/volume`);
    expect(ROUTES.WEIGHT_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/weight`);
    expect(ROUTES.TEMPERATURE_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/temperature`);
    expect(ROUTES.TIME_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/time`);
    expect(ROUTES.SPEED_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/speed`);
    expect(ROUTES.PRESSURE_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/pressure`);
    expect(ROUTES.DATA_SIZE_CONVERTER).toBe(`${UNIT_CONVERTER_ROUTE}/data-size`);
  });
});
