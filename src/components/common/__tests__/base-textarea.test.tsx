import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BaseTextarea } from '../base-textarea';

describe('BaseTextarea', () => {
  it('should render textarea with default attributes and styles when no error is provided', () => {
    render(<BaseTextarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeDefined();
    expect(textarea.getAttribute('autocomplete')).toBe('off');
    expect(textarea.getAttribute('autocorrect')).toBe('off');
    expect(textarea.getAttribute('spellcheck')).toBe('false');
    expect(textarea.classList.contains('font-mono')).toBe(true);
    expect(textarea.classList.contains('border-destructive')).toBe(false);
    expect(textarea.classList.contains('text-red-400')).toBe(false);
  });

  it('should apply error classes when error is true', () => {
    render(<BaseTextarea error placeholder="Error state" />);

    const textarea = screen.getByPlaceholderText('Error state');
    expect(textarea.classList.contains('border-destructive')).toBe(true);
    expect(textarea.classList.contains('focus-visible:border-destructive')).toBe(true);
    expect(textarea.classList.contains('text-red-400')).toBe(true);
  });

  it('should not apply error classes when error is explicitly false', () => {
    render(<BaseTextarea error={false} placeholder="No error" />);

    const textarea = screen.getByPlaceholderText('No error');
    expect(textarea.classList.contains('border-destructive')).toBe(false);
    expect(textarea.classList.contains('text-red-400')).toBe(false);
  });

  it('should merge custom className and forward props and event handlers', () => {
    const handleChange = vi.fn();

    render(<BaseTextarea className="custom-extra-class" placeholder="Type here" disabled onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText('Type here');
    expect(textarea.classList.contains('custom-extra-class')).toBe(true);
    expect(textarea.hasAttribute('disabled')).toBe(true);

    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
