import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { matchI18nPlainText, testT } from '@/test-helpers/i18n';

import { PHILOSOPHIES, WhyThisToolkit } from '../why-this-toolkit';

describe('WhyThisToolkit landing component', () => {
  it('should render section title, problem/solution description, and all core philosophies', async () => {
    const jsx = await WhyThisToolkit();
    render(jsx);

    // Section title (level 3 heading)
    expect(screen.getByRole('heading', { level: 2, name: testT('home.why.title') })).toBeDefined();

    // Problem and solution texts
    expect(screen.getByText(matchI18nPlainText('home.why.problem'))).toBeDefined();
    expect(screen.getByText(matchI18nPlainText('home.why.solution'))).toBeDefined();

    // Philosophies block heading
    expect(screen.getByText(testT('home.philosophies.title'))).toBeDefined();

    // All core philosophies
    PHILOSOPHIES.forEach(({ titleKey, descriptionKey }) => {
      expect(screen.getByText(matchI18nPlainText(titleKey))).toBeDefined();
      expect(screen.getByText(matchI18nPlainText(descriptionKey))).toBeDefined();
    });
  });
});
