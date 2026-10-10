import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Text } from '../text';

describe('Text', () => {

  it('should render default base variant as a div', () => {
    render(<Text data-testid="base-text">Default text</Text>);

    const el = screen.getByTestId('base-text');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('text-base')).toBe(true);
    expect(el.classList.contains('text-muted-foreground')).toBe(false);
  });

  it('should render inlineCode variant as code element', () => {
    render(<Text variant="inlineCode" data-testid="code-text">npm install</Text>);

    const el = screen.getByTestId('code-text');
    expect(el.tagName).toBe('CODE');
    expect(el.classList.contains('font-mono')).toBe(true);
  });

  it('should render lead variant as paragraph element', () => {
    render(<Text variant="lead" data-testid="lead-text">Lead description</Text>);

    const el = screen.getByTestId('lead-text');
    expect(el.tagName).toBe('P');
    expect(el.classList.contains('text-xl')).toBe(true);
  });

  it('should render large variant as div element', () => {
    render(<Text variant="large" data-testid="large-text">Large label</Text>);

    const el = screen.getByTestId('large-text');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('text-lg')).toBe(true);
  });

  it('should render small variant as small element', () => {
    render(<Text variant="small" data-testid="small-text">Caption text</Text>);

    const el = screen.getByTestId('small-text');
    expect(el.tagName).toBe('SMALL');
    expect(el.classList.contains('text-sm')).toBe(true);
  });

  it('should apply muted class when muted is true', () => {
    render(<Text muted data-testid="muted-text">Muted content</Text>);

    const el = screen.getByTestId('muted-text');
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
  });

  it('should merge custom className and pass other HTML attributes', () => {
    render(
      <Text className="custom-text-class" aria-label="accessible-text" data-testid="custom-text">
        Sample
      </Text>
    );

    const el = screen.getByTestId('custom-text');
    expect(el.classList.contains('custom-text-class')).toBe(true);
    expect(el.getAttribute('aria-label')).toBe('accessible-text');
  });
});
