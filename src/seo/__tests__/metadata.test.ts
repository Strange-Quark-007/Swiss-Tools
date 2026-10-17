import { describe, expect, it } from 'vitest';

import { APP_NAME } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { APP_MANIFEST_ICON_PATH } from '@/constants/seo';
import { testT } from '@/test-helpers/i18n';

import { createPageMetadata, createToolMetadata, getRoutePrefix } from '../metadata';

describe('metadata helpers (seo/metadata.ts)', () => {
  describe('getRoutePrefix', () => {
    it('should convert single-segment kebab routes to camelCase prefix', () => {
      expect(getRoutePrefix(ROUTES.CASE_CONVERTER)).toBe('caseConverter');
      expect(getRoutePrefix(ROUTES.COLOR_PICKER)).toBe('colorPicker');
      expect(getRoutePrefix(ROUTES.DATA_FORMAT_CONVERTER)).toBe('dataFormatConverter');
      expect(getRoutePrefix(ROUTES.ENCODER_DECODER)).toBe('encoderDecoder');
      expect(getRoutePrefix(ROUTES.HASH_GENERATOR)).toBe('hashGenerator');
      expect(getRoutePrefix(ROUTES.ID_GENERATOR)).toBe('idGenerator');
      expect(getRoutePrefix(ROUTES.JWT_DECODER)).toBe('jwtDecoder');
      expect(getRoutePrefix(ROUTES.LOREM_GENERATOR)).toBe('loremGenerator');
      expect(getRoutePrefix(ROUTES.NUMBER_CONVERTER)).toBe('numberConverter');
      expect(getRoutePrefix(ROUTES.REGEX_TESTER)).toBe('regexTester');
    });

    it('should convert multi-segment unit converter routes to typeConverter prefix', () => {
      expect(getRoutePrefix(ROUTES.LENGTH_CONVERTER)).toBe('lengthConverter');
      expect(getRoutePrefix(ROUTES.AREA_CONVERTER)).toBe('areaConverter');
      expect(getRoutePrefix(ROUTES.VOLUME_CONVERTER)).toBe('volumeConverter');
      expect(getRoutePrefix(ROUTES.WEIGHT_CONVERTER)).toBe('weightConverter');
      expect(getRoutePrefix(ROUTES.TEMPERATURE_CONVERTER)).toBe('temperatureConverter');
      expect(getRoutePrefix(ROUTES.TIME_CONVERTER)).toBe('timeConverter');
      expect(getRoutePrefix(ROUTES.SPEED_CONVERTER)).toBe('speedConverter');
      expect(getRoutePrefix(ROUTES.DATA_SIZE_CONVERTER)).toBe('dataSizeConverter');
    });
  });

  describe('createPageMetadata', () => {
    it('should create standardized page metadata with Open Graph and Twitter cards', async () => {
      const meta = await createPageMetadata({
        titleKey: 'home.meta.title',
        descriptionKey: 'home.meta.description',
        pathname: ROUTES.HOME,
        keywords: ['utilities', 'tools'],
      });

      const expectedTitle = testT('home.meta.title');
      const expectedDescription = testT('home.meta.description');

      expect(meta.title).toBe(expectedTitle);
      expect(meta.description).toBe(expectedDescription);
      expect(meta.keywords).toEqual(['utilities', 'tools']);
      expect(meta.alternates?.canonical).toBe(ROUTES.HOME);

      expect(meta.openGraph).toEqual({
        title: expectedTitle,
        description: expectedDescription,
        url: ROUTES.HOME,
        siteName: APP_NAME,
        type: 'website',
        images: [
          {
            url: APP_MANIFEST_ICON_PATH,
            width: 512,
            height: 512,
            alt: expectedTitle,
          },
        ],
      });

      expect(meta.twitter).toEqual({
        card: 'summary_large_image',
        title: expectedTitle,
        description: expectedDescription,
        images: [APP_MANIFEST_ICON_PATH],
      });
    });
  });

  describe('createToolMetadata', () => {
    it('should automatically derive prefix from route without manual prefix argument', async () => {
      const meta = await createToolMetadata(ROUTES.CASE_CONVERTER);

      const expectedTitle = testT('caseConverter.meta.title');
      const expectedDescription = testT('caseConverter.meta.description');

      expect(meta.title).toBe(expectedTitle);
      expect(meta.description).toBe(expectedDescription);
      expect(meta.openGraph?.title).toBe(expectedTitle);
      expect(meta.twitter?.title).toBe(expectedTitle);
    });

    it('should automatically derive prefix for unit converter routes', async () => {
      const meta = await createToolMetadata(ROUTES.LENGTH_CONVERTER);

      const expectedTitle = testT('lengthConverter.meta.title');
      const expectedDescription = testT('lengthConverter.meta.description');

      expect(meta.title).toBe(expectedTitle);
      expect(meta.description).toBe(expectedDescription);
    });
  });
});
