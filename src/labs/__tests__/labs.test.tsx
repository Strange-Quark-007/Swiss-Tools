import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { matchI18nPlainText, testT } from '@/test-helpers/i18n';

import { Labs } from '../labs';

describe('Labs page component', () => {
  it('should render labs content with back button, heading, and subtitle', async () => {
    const jsx = await Labs();
    render(jsx);

    const backButton = screen.getByRole('button', { name: testT('label.back') });
    expect(backButton).toBeDefined();

    expect(screen.getByText(testT('labs.title'))).toBeDefined();
    expect(screen.getByText(testT('labs.badge'))).toBeDefined();
    expect(screen.getByText(matchI18nPlainText('labs.subtitle'))).toBeDefined();
    expect(screen.getByText(testT('labs.magicDrop.title'))).toBeDefined();
  });
});
