import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import { TooltipWrapper } from '../tooltip-wrapper';

describe('TooltipWrapper', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render trigger child element properly', () => {
    render(
      <TooltipWrapper content="Tooltip text content">
        <button data-testid="trigger-btn">Hover Target</button>
      </TooltipWrapper>
    );

    const button = screen.getByTestId('trigger-btn');
    expect(button).toBeDefined();
    expect(button.textContent).toBe('Hover Target');
  });

  it('should pass triggerProps and contentProps to underlying elements', () => {
    render(
      <TooltipWrapper
        content={<span data-testid="tooltip-inner">Helpful advice</span>}
        triggerProps={{ id: 'custom-trigger-id' }}
        contentProps={{ id: 'custom-content-id', className: 'custom-class' }}
      >
        <button>Trigger</button>
      </TooltipWrapper>
    );

    const button = screen.getByText('Trigger');
    expect(button.getAttribute('id')).toBe('custom-trigger-id');
  });
});
