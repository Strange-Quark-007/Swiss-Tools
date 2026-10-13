import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CurrentTimeTicker } from '../current-time-ticker';
import { TIMESTAMP_FORMATS } from '../utils';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

describe('CurrentTimeTicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it('should render the live epoch ticker', () => {
    render(<CurrentTimeTicker fromFormat={TIMESTAMP_FORMATS.unixSec.value} onUseNow={vi.fn()} />);

    expect(screen.getByText(/Current Unix Epoch/i)).toBeDefined();
  });

  it('should copy current epoch and display inline copied feedback', () => {
    render(<CurrentTimeTicker fromFormat={TIMESTAMP_FORMATS.unixSec.value} onUseNow={vi.fn()} />);

    const copyButton = screen.getByRole('button', { name: /Copy Epoch/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(copyButton.querySelector('.lucide-check')).not.toBeNull();
  });

  it('should call onUseNow with formatted time when insert button is clicked', () => {
    const onUseNowMock = vi.fn();
    render(<CurrentTimeTicker fromFormat={TIMESTAMP_FORMATS.unixSec.value} onUseNow={onUseNowMock} />);

    const useButton = screen.getByRole('button', { name: /Use Current Epoch/i });
    fireEvent.click(useButton);

    expect(onUseNowMock).toHaveBeenCalledTimes(1);
    expect(typeof onUseNowMock.mock.calls[0][0]).toBe('string');
    expect(onUseNowMock.mock.calls[0][0].length).toBeGreaterThan(0);
  });

  it('should update current epoch on interval and revert copied state after timeout', () => {
    vi.useFakeTimers();
    render(<CurrentTimeTicker fromFormat={TIMESTAMP_FORMATS.unixSec.value} onUseNow={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const copyButton = screen.getByRole('button', { name: /Copy Epoch/i });
    fireEvent.click(copyButton);
    expect(copyButton.querySelector('.lucide-check')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(copyButton.querySelector('.lucide-copy')).not.toBeNull();

    vi.useRealTimers();
  });
});
