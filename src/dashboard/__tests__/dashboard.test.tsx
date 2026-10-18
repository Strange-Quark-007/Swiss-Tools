import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { Dashboard } from '../dashboard';

vi.mock('../modules-list', () => ({
  ModulesList: () => <div>Modules List Component</div>,
}));

describe('Dashboard component', () => {
  it('should render title, description, and ModulesList', async () => {
    const jsx = await Dashboard();
    render(jsx);

    expect(screen.getByText(testT('dashboard.title'))).toBeDefined();
    expect(screen.getByText(testT('dashboard.paragraph'))).toBeDefined();
    expect(screen.getByText('Modules List Component')).toBeDefined();
  });
});
