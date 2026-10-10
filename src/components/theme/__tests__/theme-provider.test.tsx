import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { ThemeProvider } from '../theme-provider';

const mockNextThemesProvider = vi.fn(({ children }: React.PropsWithChildren) => <>{children}</>);

vi.mock('next-themes', () => ({
  ThemeProvider: (props: React.PropsWithChildren) => mockNextThemesProvider(props),
}));

describe('ThemeProvider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children correctly and forward props to NextThemesProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <span data-testid="theme-child">Child Element</span>
      </ThemeProvider>
    );

    const child = screen.getByTestId('theme-child');
    expect(child).toBeDefined();
    expect(child.textContent).toBe('Child Element');
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'class',
        defaultTheme: 'dark',
      })
    );
  });
});
