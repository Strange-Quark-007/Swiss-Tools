import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { Labs } from '../labs';

describe('Labs page component', () => {
  it('should render labs content with home link, heading, and subtitle', async () => {
    const jsx = await Labs();
    render(jsx);

    const homeLink = screen.getByRole('link', { name: testT('label.home') });
    expect(homeLink).toBeDefined();
    expect(homeLink.getAttribute('href')).toBe('/');

    expect(screen.getByText(testT('labs.title'))).toBeDefined();
    expect(screen.getByText(testT('labs.subtitle'))).toBeDefined();
  });
});
