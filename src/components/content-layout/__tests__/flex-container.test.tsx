import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import { FlexContainer } from '../flex-container';

describe('FlexContainer', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render with default id and row direction', () => {
    render(
      <FlexContainer direction="row">
        <span>Child 1</span>
        <span>Child 2</span>
      </FlexContainer>
    );

    const container = document.getElementById('flex-container');
    expect(container).toBeDefined();
    expect(container?.classList.contains('flex-row')).toBe(true);
    expect(container?.classList.contains('gap-4')).toBe(true);
    expect(screen.getByText('Child 1')).toBeDefined();
    expect(screen.getByText('Child 2')).toBeDefined();
  });

  it('should support col direction, custom id, and merged className', () => {
    render(
      <FlexContainer id="custom-flex" direction="col" className="custom-class">
        <span>Column Item</span>
      </FlexContainer>
    );

    const container = document.getElementById('custom-flex');
    expect(container).toBeDefined();
    expect(container?.classList.contains('flex-col')).toBe(true);
    expect(container?.classList.contains('custom-class')).toBe(true);
  });
});
