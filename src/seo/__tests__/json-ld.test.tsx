import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/constants/routes';

import { generateBreadcrumbJsonLd, generateToolJsonLd, generateWebsiteJsonLd, JsonLd } from '../json-ld';

describe('JSON-LD (seo/json-ld.tsx)', () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

  describe('JsonLd component', () => {
    it('should render script tag with application/ld+json and stringified json data', () => {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Swiss Tools',
      };

      const { container } = render(<JsonLd data={data} />);
      const script = container.querySelector('script[type="application/ld+json"]');

      expect(script).toBeDefined();
      expect(script?.textContent).toBe(JSON.stringify(data));
    });
  });

  describe('schema generators', () => {
    it('should generate valid WebSite schema', () => {
      const schema = generateWebsiteJsonLd();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Swiss Tools');
      expect(schema.url).toBe(baseUrl);
      expect(schema.publisher).toEqual({
        '@type': 'Organization',
        name: 'Swiss Tools',
        url: baseUrl,
        logo: `${baseUrl}/web-app-manifest-512x512.png`,
      });

      const customSchema = generateWebsiteJsonLd({ description: 'Custom toolbox description' });
      expect(customSchema.description).toBe('Custom toolbox description');
    });

    it('should generate valid WebApplication schema for tools', () => {
      const schema = generateToolJsonLd({
        name: 'Text Case Converter',
        description: 'Convert text case online',
        path: ROUTES.CASE_CONVERTER,
        category: 'UtilitiesApplication',
      });

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebApplication');
      expect(schema.name).toBe('Text Case Converter');
      expect(schema.url).toBe(`${baseUrl}${ROUTES.CASE_CONVERTER}`);
      expect(schema.applicationCategory).toBe('UtilitiesApplication');
      expect(schema.operatingSystem).toBe('All');
      expect(schema.isAccessibleForFree).toBe(true);
      expect(schema.featureList).toBeDefined();
      expect(schema.featureList.length).toBeGreaterThan(0);
      expect(schema.creator).toEqual({
        '@type': 'Organization',
        name: 'Strange Quark',
        url: 'https://github.com/Strange-Quark-007',
      });
    });

    it('should generate valid BreadcrumbList schema', () => {
      const schema = generateBreadcrumbJsonLd([
        { name: 'Home', url: ROUTES.HOME },
        { name: 'Case Converter', url: ROUTES.CASE_CONVERTER },
      ]);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toEqual([
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseUrl}${ROUTES.HOME}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Case Converter',
          item: `${baseUrl}${ROUTES.CASE_CONVERTER}`,
        },
      ]);

      const externalSchema = generateBreadcrumbJsonLd([{ name: 'Docs', url: 'https://example.com/docs' }]);
      expect(externalSchema.itemListElement[0].item).toBe('https://example.com/docs');
    });
  });
});
