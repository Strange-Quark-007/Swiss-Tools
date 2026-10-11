import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import CustomBaseForm from '../custom-base-form';

describe('CustomBaseForm', () => {
  const mockOnCustomBaseChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input and call onCustomBaseChange on valid numeric input', () => {
    render(<CustomBaseForm customBase="16" onCustomBaseChange={mockOnCustomBaseChange} />);

    const input = screen.getByPlaceholderText(testT('numberConverter.customPlaceholder'));
    expect((input as HTMLInputElement).value).toBe('16');

    fireEvent.change(input, { target: { value: '32' } });
    expect(mockOnCustomBaseChange).toHaveBeenCalledWith('32');
  });

  it('should ignore non-numeric inputs or lengths greater than 2', () => {
    render(<CustomBaseForm customBase="16" onCustomBaseChange={mockOnCustomBaseChange} />);

    const input = screen.getByPlaceholderText(testT('numberConverter.customPlaceholder'));

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnCustomBaseChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '123' } });
    expect(mockOnCustomBaseChange).not.toHaveBeenCalled();
  });

  it('should trigger form validation on blur when out of range', async () => {
    render(<CustomBaseForm customBase="99" onCustomBaseChange={mockOnCustomBaseChange} />);

    const input = screen.getByPlaceholderText(testT('numberConverter.customPlaceholder'));
    fireEvent.blur(input);

    await vi.waitFor(() => {
      expect(screen.getByText(testT('numberConverter.baseRange'))).toBeDefined();
    });
  });
});
