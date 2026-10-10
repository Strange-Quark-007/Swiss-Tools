import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useTrackEvent } from '@/hooks/use-ga-events';

import { Button } from '../button';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(),
}));

describe('Button common component', () => {
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
  });

  afterEach(() => {
    cleanup();
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
});
