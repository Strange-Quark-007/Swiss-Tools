import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonLd } from '../json-ld';

describe('JsonLd component (components/seo/json-ld.tsx)', () => {
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
