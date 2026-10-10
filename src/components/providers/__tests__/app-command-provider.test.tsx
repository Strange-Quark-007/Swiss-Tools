import { cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { AppCommandProvider, useAppCommand } from '../app-command-provider';

vi.mock('../../app-layout/app-command', () => ({
  AppCommand: ({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) => (
    <button data-testid="mock-app-command" data-open={open} onClick={() => setOpen(!open)}>
      Toggle
    </button>
  ),
}));

describe('AppCommandProvider and useAppCommand', () => {
  afterEach(() => {
    cleanup();
  });

  it('should provide default setOpen function when rendered outside provider', () => {
    const { result } = renderHook(() => useAppCommand());

    expect(result.current.setOpen).toBeDefined();
    expect(typeof result.current.setOpen).toBe('function');
    expect(() => result.current.setOpen(true)).not.toThrow();
  });

  it('should provide context value and toggle open state via AppCommandProvider', () => {
    function ConsumerComponent() {
      const { setOpen } = useAppCommand();
      return (
        <button data-testid="consumer-button" onClick={() => setOpen(true)}>
          Open Command
        </button>
      );
    }

    render(
      <AppCommandProvider>
        <ConsumerComponent />
      </AppCommandProvider>
    );

    const commandWidget = screen.getByTestId('mock-app-command');
    expect(commandWidget.getAttribute('data-open')).toBe('false');

    fireEvent.click(screen.getByTestId('consumer-button'));
    expect(commandWidget.getAttribute('data-open')).toBe('true');
  });
});
