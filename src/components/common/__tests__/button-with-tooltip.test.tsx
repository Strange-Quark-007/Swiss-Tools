import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useTrackEvent } from '@/hooks/use-ga-events';

import { ButtonWithTooltip } from '../button-with-tooltip';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(),
}));

describe('ButtonWithTooltip', () => {
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
  });

  it('should render button with default type "button", aria-label, and trigger click events', () => {
    const mockOnClick = vi.fn();

    render(
      <ButtonWithTooltip
        ariaLabel="Copy code"
        tooltip="Copy to clipboard"
        eventName={GA_EVENTS.COPY_RESULT}
        onClick={mockOnClick}
      >
        Copy
      </ButtonWithTooltip>
    );

    const button = screen.getByRole('button', { name: 'Copy code' });
    expect(button).toBeDefined();
    expect(button.getAttribute('type')).toBe('button');
    expect(button.textContent).toBe('Copy');

    fireEvent.click(button);

    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.COPY_RESULT, {});
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should support custom button type and trigger/content props', () => {
    render(
      <ButtonWithTooltip
        type="submit"
        ariaLabel="Submit form"
        tooltip="Click to submit"
        eventName={GA_EVENTS.CONVERT}
        triggerProps={{ id: 'submit-trigger' }}
        contentProps={{ className: 'custom-tooltip-content' }}
      >
        Submit
      </ButtonWithTooltip>
    );

    const button = screen.getByRole('button', { name: 'Submit form' });
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.getAttribute('id')).toBe('submit-trigger');
  });
});
