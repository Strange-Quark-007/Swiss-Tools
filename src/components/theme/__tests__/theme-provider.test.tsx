import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { ThemeProvider } from '../theme-provider';

describe('ThemeProvider', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render children correctly within ThemeProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <span data-testid="theme-child">Child Element</span>
      </ThemeProvider>
    );

    const child = screen.getByTestId('theme-child');
    expect(child).toBeDefined();
    expect(child.textContent).toBe('Child Element');
  });
});
