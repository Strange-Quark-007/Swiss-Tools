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
  it('should render desktop direct links to Preferences and Labs, and mobile settings dropdown', () => {
    render(<AppNavbarMenu />);

    // Desktop direct links
    const desktopPreferencesLink = screen.getByRole('link', { name: testT('preferences.title') });
    expect(desktopPreferencesLink).toBeDefined();
    expect(desktopPreferencesLink.getAttribute('href')).toBe(ROUTES.PREFERENCES);

    const desktopLabsLink = screen.getByRole('link', { name: testT('labs.title') });
    expect(desktopLabsLink).toBeDefined();
    expect(desktopLabsLink.getAttribute('href')).toBe(ROUTES.LABS);
    expect(document.querySelector('[data-slot="labs-dot"]')).not.toBeNull();

    // Mobile dropdown
    const triggerButton = screen.getByRole('button', { name: testT('label.settings') });
    expect(triggerButton).toBeDefined();

    fireEvent.pointerDown(triggerButton, { button: 0 });

    const preferencesMenuItem = screen.getByRole('menuitem', { name: testT('preferences.title') });
    expect(preferencesMenuItem).toBeDefined();
    expect(preferencesMenuItem.getAttribute('href')).toBe(ROUTES.PREFERENCES);

    const labsMenuItem = screen.getByRole('menuitem', {
      name: new RegExp(`${testT('labs.title')}.*${testT('label.experimental')}`),
    });
    expect(labsMenuItem).toBeDefined();
    expect(labsMenuItem.getAttribute('href')).toBe(ROUTES.LABS);
    expect(screen.getByText(testT('label.experimental'))).toBeDefined();
  });
});
