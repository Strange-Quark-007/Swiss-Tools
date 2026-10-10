import { fireEvent, render, screen } from '@testing-library/react';
import React, { forwardRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useTrackEvent } from '@/hooks/use-ga-events';

import { withGATracking } from '../with-ga-tracking';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: vi.fn(),
}));

describe('withGATracking HOC', () => {
  const mockTrackEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrackEvent).mockReturnValue(mockTrackEvent);
  });

  it('should render wrapped component with correct displayName from displayName property', () => {
    const CustomButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
    CustomButton.displayName = 'CustomButtonName';

    const TrackedButton = withGATracking(CustomButton);
    expect(TrackedButton.displayName).toBe('withGATracking(CustomButtonName)');

    render(<TrackedButton eventName={GA_EVENTS.CONVERT}>Click Me</TrackedButton>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('should fall back to component name or "Component" for displayName', () => {
    function NamedComponent(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
      return <button {...props} />;
    }
    const TrackedNamed = withGATracking(NamedComponent);
    expect(TrackedNamed.displayName).toBe('withGATracking(NamedComponent)');

    const Anonymous = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
      <button ref={ref} {...props} />
    ));
    Anonymous.displayName = undefined;
    Object.defineProperty(Anonymous, 'name', { value: '' });

    const TrackedAnon = withGATracking(Anonymous);
    expect(TrackedAnon.displayName).toBe('withGATracking(Component)');
  });

  it('should call trackEvent and onClick callback when clicked', () => {
    const SimpleButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
    const TrackedButton = withGATracking(SimpleButton);
    const mockOnClick = vi.fn();

    render(
      <TrackedButton
        eventName={GA_EVENTS.CLEAR}
        eventParams={{ source: 'header' }}
        onClick={mockOnClick}
      >
        Clear
      </TrackedButton>
    );

    fireEvent.click(screen.getByText('Clear'));

    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.CLEAR, { source: 'header' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should default eventParams to empty object and handle click without onClick prop', () => {
    const SimpleButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;
    const TrackedButton = withGATracking(SimpleButton);

    render(<TrackedButton eventName={GA_EVENTS.RESET}>Reset</TrackedButton>);

    fireEvent.click(screen.getByText('Reset'));

    expect(mockTrackEvent).toHaveBeenCalledWith(GA_EVENTS.RESET, {});
  });
});
