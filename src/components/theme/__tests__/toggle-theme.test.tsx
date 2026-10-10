import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

import { useTrackEvent } from '@/hooks/use-ga-events';

import { ToggleTheme } from '../toggle-theme';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(),
}));

vi.mock('@/i18n/utils', () => ({
  useT: () => ({
    t: (key: string) => key,
  }),
}));

describe('ToggleTheme', () => {
  const mockSetTheme = vi.fn();
  const mockUseTheme = useTheme as unknown as Mock;
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
  });

  afterEach(() => {
    cleanup();
  });

  it('should switch to light theme when current theme is dark', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ToggleTheme />);

    const button = screen.getByRole('button', { name: 'sr.toggleTheme' });
    expect(button).toBeDefined();
    expect(screen.getByText('sr.toggleTheme')).toBeDefined();

    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should switch to dark theme when current theme is light', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ToggleTheme />);

    const button = screen.getByRole('button', { name: 'sr.toggleTheme' });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
