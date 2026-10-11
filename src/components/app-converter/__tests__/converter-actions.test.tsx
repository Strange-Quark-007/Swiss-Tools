import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useTrackEvent } from '@/hooks/use-ga-events';
import { testT } from '@/test-helpers/i18n';

import { ConverterActions } from '../converter-actions';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(),
}));

const mockUseTransition = vi.fn();

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useTransition: () => mockUseTransition(),
  };
});

describe('ConverterActions', () => {
  const mockTrackEvent = vi.fn();
  const mockSetAuto = vi.fn();
  const mockOnConvert = vi.fn();
  const mockOnSwap = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
    mockUseTransition.mockReturnValue([false, (cb: () => void) => cb()]);
  });

  it('should render all action buttons and checkbox with correct initial states', () => {
    render(
      <ConverterActions
        auto={false}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: testT('label.auto') });
    expect(checkbox).toBeDefined();
    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    expect(convertBtn).toBeDefined();
    expect(convertBtn.hasAttribute('disabled')).toBe(false);

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    expect(swapBtn).toBeDefined();
    expect(swapBtn.hasAttribute('disabled')).toBe(false);

    const resetBtn = screen.getByRole('button', { name: testT('label.reset') });
    expect(resetBtn).toBeDefined();
  });

  it('should disable convert button when auto is true', () => {
    render(
      <ConverterActions
        auto={true}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    expect(convertBtn.hasAttribute('disabled')).toBe(true);
  });

  it('should toggle auto checkbox and track events', () => {
    const { rerender } = render(
      <ConverterActions
        auto={false}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: testT('label.auto') });
    fireEvent.click(checkbox);

    expect(mockSetAuto).toHaveBeenCalledWith(true);
    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.AUTO_CHECK);

    rerender(
      <ConverterActions
        auto={true}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    fireEvent.click(checkbox);
    expect(mockSetAuto).toHaveBeenCalledWith(false);
    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.AUTO_UNCHECK);
  });

  it('should trigger onConvert when convert button is clicked', () => {
    render(<ConverterActions auto={false} setAuto={mockSetAuto} onConvert={mockOnConvert} onReset={mockOnReset} />);

    const convertBtn = screen.getByRole('button', { name: testT('label.convert') });
    fireEvent.click(convertBtn);

    expect(mockOnConvert).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSwap when swap button is clicked and handle disableSwap prop', () => {
    const { rerender } = render(
      <ConverterActions
        auto={false}
        disableSwap={false}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    fireEvent.click(swapBtn);
    expect(mockOnSwap).toHaveBeenCalledTimes(1);

    rerender(
      <ConverterActions
        auto={false}
        disableSwap={true}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    expect(swapBtn.hasAttribute('disabled')).toBe(true);
    fireEvent.click(swapBtn);
    expect(mockOnSwap).toHaveBeenCalledTimes(1);
  });

  it('should disable swap button and prevent action when transition is pending', () => {
    mockUseTransition.mockReturnValue([true, vi.fn()]);

    render(
      <ConverterActions
        auto={false}
        disableSwap={false}
        setAuto={mockSetAuto}
        onConvert={mockOnConvert}
        onSwap={mockOnSwap}
        onReset={mockOnReset}
      />
    );

    const swapBtn = screen.getByRole('button', { name: testT('label.swap') });
    expect(swapBtn.hasAttribute('disabled')).toBe(true);
    fireEvent.click(swapBtn);
    expect(mockOnSwap).not.toHaveBeenCalled();
  });

  it('should not render swap button if onSwap is not provided', () => {
    render(<ConverterActions auto={false} setAuto={mockSetAuto} onConvert={mockOnConvert} onReset={mockOnReset} />);

    expect(screen.queryByRole('button', { name: testT('label.swap') })).toBeNull();
  });

  it('should trigger onReset when reset button is clicked', () => {
    render(<ConverterActions auto={false} setAuto={mockSetAuto} onConvert={mockOnConvert} onReset={mockOnReset} />);

    const resetBtn = screen.getByRole('button', { name: testT('label.reset') });
    fireEvent.click(resetBtn);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
