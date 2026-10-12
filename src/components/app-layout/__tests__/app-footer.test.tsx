import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CREATOR_NAME, CREATOR_URL, GITHUB_URL } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { testT } from '@/test-helpers/i18n';

import { Footer } from '../app-footer';

describe('Footer', () => {
  it('should render author details, privacy link, github link, and copyright notice', async () => {
    const jsx = await Footer();
    render(jsx);

    expect(screen.getByText(`${testT('label.developedBy')}:`)).toBeDefined();

    const creatorLink = screen.getByRole('link', { name: CREATOR_NAME });
    expect(creatorLink).toBeDefined();
    expect(creatorLink.getAttribute('href')).toBe(CREATOR_URL);

    const privacyLink = screen.getByRole('link', { name: testT('label.privacy') });
    expect(privacyLink).toBeDefined();
    expect(privacyLink.getAttribute('href')).toBe(ROUTES.PRIVACY);

    expect(screen.getByText(testT('footer.openSource'))).toBeDefined();

    const githubLink = screen.getByRole('link', { name: testT('label.github') });
    expect(githubLink).toBeDefined();
    expect(githubLink.getAttribute('href')).toBe(GITHUB_URL);

    expect(screen.getByText(testT('footer.copyright'))).toBeDefined();
  });
});
