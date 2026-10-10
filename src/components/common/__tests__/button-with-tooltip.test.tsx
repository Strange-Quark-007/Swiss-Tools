import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { GA_EVENTS } from '@/constants/gaEvents';

import type { ButtonProps } from '../button';
import { ButtonWithTooltip } from '../button-with-tooltip';

vi.mock('../button', () => ({
  Button: ({ children, eventName: _eventName, ...props }: ButtonProps) => <button {...props}>{children}</button>,
}));

describe('ButtonWithTooltip', () => {
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
