import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { testT } from '@/test-helpers/i18n';

import { AppNavbarMenu } from '../app-navbar-menu';

vi.mock('@/components/ui/dropdown-menu', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/ui/dropdown-menu')>();
  return {
    ...actual,
    DropdownMenuContent: ({ onCloseAutoFocus, ...props }: React.ComponentProps<typeof actual.DropdownMenuContent>) => {
      onCloseAutoFocus?.({ preventDefault: vi.fn() } as unknown as Event);
      return <actual.DropdownMenuContent onCloseAutoFocus={onCloseAutoFocus} {...props} />;
    },
  };
});

describe('AppNavbarMenu', () => {
  it('should render settings trigger button and show links to Preferences and Labs when clicked', () => {
    render(<AppNavbarMenu />);

    const triggerButton = screen.getByRole('button', { name: testT('label.settings') });
    expect(triggerButton).toBeDefined();

    fireEvent.pointerDown(triggerButton, { button: 0 });

    const preferencesLink = screen.getByRole('menuitem', { name: testT('preferences.title') });
    expect(preferencesLink).toBeDefined();
    expect(preferencesLink.getAttribute('href')).toBe(ROUTES.PREFERENCES);

    const labsLink = screen.getByRole('menuitem', { name: testT('labs.title') });
    expect(labsLink).toBeDefined();
    expect(labsLink.getAttribute('href')).toBe(ROUTES.LABS);
  });
});
