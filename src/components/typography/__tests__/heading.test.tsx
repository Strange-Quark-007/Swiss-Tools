import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import { Heading } from '../heading';

describe('Heading', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render an h1 by default when level is not specified', () => {
    render(<Heading>Main Heading</Heading>);

    const heading = screen.getByRole('heading', { level: 1, name: 'Main Heading' });
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe('H1');
    expect(heading.classList.contains('text-4xl')).toBe(true);
    expect(heading.classList.contains('text-muted-foreground')).toBe(false);
  });

  it('should render appropriate heading elements for levels 2, 3, and 4', () => {
    const { rerender } = render(<Heading level={2}>Level 2</Heading>);
    let heading = screen.getByRole('heading', { level: 2, name: 'Level 2' });
    expect(heading.tagName).toBe('H2');
    expect(heading.classList.contains('text-3xl')).toBe(true);

    rerender(<Heading level={3}>Level 3</Heading>);
    heading = screen.getByRole('heading', { level: 3, name: 'Level 3' });
    expect(heading.tagName).toBe('H3');
    expect(heading.classList.contains('text-2xl')).toBe(true);

    rerender(<Heading level={4}>Level 4</Heading>);
    heading = screen.getByRole('heading', { level: 4, name: 'Level 4' });
    expect(heading.tagName).toBe('H4');
    expect(heading.classList.contains('text-xl')).toBe(true);
  });

  it('should apply muted styling when muted is true', () => {
    render(<Heading muted>Muted Heading</Heading>);

    const heading = screen.getByRole('heading', { level: 1, name: 'Muted Heading' });
    expect(heading.classList.contains('text-muted-foreground')).toBe(true);
  });

  it('should merge custom className and forward props', () => {
    render(
      <Heading id="custom-heading" className="custom-class" data-testid="heading-el">
        Custom Heading
      </Heading>
    );

    const heading = screen.getByTestId('heading-el');
    expect(heading.getAttribute('id')).toBe('custom-heading');
    expect(heading.classList.contains('custom-class')).toBe(true);
  });
});
