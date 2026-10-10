import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ViewTransitionProvider } from '../view-transition-provider';

describe('ViewTransitionProvider', () => {
  it('should render children elements properly', () => {
    render(
      <ViewTransitionProvider>
        <div data-testid="child-element">Hello Transitions</div>
      </ViewTransitionProvider>
    );

    expect(screen.getByTestId('child-element')).toBeDefined();
    expect(screen.getByText('Hello Transitions')).toBeDefined();
  });
});
