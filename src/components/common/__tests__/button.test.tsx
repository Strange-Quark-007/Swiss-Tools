import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GA_EVENTS } from '@/constants/ga-events';
import { useTrackEvent } from '@/hooks/use-ga-events';

import { Button } from '../button';

describe('Button common component', () => {
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
  });

  it('should render button text and trigger GA tracking on click', () => {
    const mockOnClick = vi.fn();

    render(
      <Button eventName={GA_EVENTS.CONVERT} eventParams={{ module: 'sample' }} onClick={mockOnClick}>
        Convert
      </Button>
    );

    const button = screen.getByText('Convert');
    expect(button).toBeDefined();

    fireEvent.click(button);

    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.CONVERT, { module: 'sample' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should support button variants and disabled state', () => {
    render(
      <Button eventName={GA_EVENTS.DOWNLOAD} disabled variant="outline">
        Disabled Action
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Disabled Action' });
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild eventName={GA_EVENTS.CONVERT}>
        <a href="/test-link">Link Action</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Link Action' });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/test-link');
    expect(link.getAttribute('data-slot')).toBe('button');
  });

  it('should render untracked button and not trigger GA tracking when disableTracking is true', () => {
    const mockOnClick = vi.fn();

    render(
      <Button disableTracking onClick={mockOnClick}>
        Untracked Action
      </Button>
    );

    const button = screen.getByText('Untracked Action');
    expect(button).toBeDefined();

    fireEvent.click(button);

    expect(mockTrackEvent).not.toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
