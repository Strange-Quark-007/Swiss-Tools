import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import { SplitView } from '../split-view';

describe('SplitView', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render two-column split layout when center is not provided', () => {
    render(
      <SplitView
        left={<div data-testid="left-pane">Left Content</div>}
        right={<div data-testid="right-pane">Right Content</div>}
      />
    );

    const container = document.getElementById('split-view');
    expect(container).toBeDefined();
    expect(container?.classList.contains('lg:grid-cols-2')).toBe(true);
    expect(screen.getByTestId('left-pane')).toBeDefined();
    expect(screen.getByTestId('right-pane')).toBeDefined();
  });

  it('should render three-column layout when center is provided', () => {
    render(
      <SplitView
        left={<div>Left</div>}
        center={<div data-testid="center-pane">Center Divider</div>}
        right={<div>Right</div>}
      />
    );

    const container = document.getElementById('split-view');
    expect(container?.classList.contains('lg:grid-cols-[1fr_auto_1fr]')).toBe(true);
    expect(screen.getByTestId('center-pane')).toBeDefined();
  });

  it('should merge custom className', () => {
    render(
      <SplitView
        left={<div>Left</div>}
        right={<div>Right</div>}
        className="custom-split-view"
      />
    );

    const container = document.getElementById('split-view');
    expect(container?.classList.contains('custom-split-view')).toBe(true);
  });
});
