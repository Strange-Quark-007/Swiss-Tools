import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Paragraph } from '../paragraph';

describe('Paragraph', () => {

  it('should render standard paragraph element with default styles', () => {
    render(<Paragraph>Normal paragraph content</Paragraph>);

    const paragraph = screen.getByText('Normal paragraph content');
    expect(paragraph.tagName).toBe('P');
    expect(paragraph.classList.contains('leading-7')).toBe(true);
  });

  it('should render blockquote element when isBlockquote is true', () => {
    render(<Paragraph isBlockquote>Quote content</Paragraph>);

    const blockquote = screen.getByText('Quote content');
    expect(blockquote.tagName).toBe('BLOCKQUOTE');
    expect(blockquote.classList.contains('italic')).toBe(true);
    expect(blockquote.classList.contains('border-l-2')).toBe(true);
  });

  it('should merge custom className and pass through props', () => {
    render(
      <Paragraph className="custom-paragraph-class" data-testid="para-test">
        Styled text
      </Paragraph>
    );

    const el = screen.getByTestId('para-test');
    expect(el.classList.contains('custom-paragraph-class')).toBe(true);
    expect(el.textContent).toBe('Styled text');
  });
});
