import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { BackButton } from '../back-button';

describe('BackButton component', () => {
  const mockBack = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({
      back: mockBack,
      push: mockPush,
    });
  });

  it('renders default text and aria-label', () => {
    render(<BackButton />);

    const button = screen.getByRole('button', { name: testT('label.back') });
    expect(button).toBeDefined();
    expect(button.textContent).toContain(testT('label.back'));
  });

  it('renders with custom className when provided', () => {
    render(<BackButton className="custom-test-class" />);

    const button = screen.getByRole('button', { name: testT('label.back') });
    expect(button.className).toBe('custom-test-class');
  });

  it('calls router.back when history length is greater than 1', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true,
    });

    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: testT('label.back') }));
    expect(mockBack).toHaveBeenCalledOnce();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('calls router.push with default "/" fallback when history length is 1 or less', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    });

    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: testT('label.back') }));
    expect(mockPush).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('calls router.push with custom fallbackUrl when history length is 1 or less', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    });

    render(<BackButton fallbackUrl="/tools" />);

    fireEvent.click(screen.getByRole('button', { name: testT('label.back') }));
    expect(mockPush).toHaveBeenCalledWith('/tools');
    expect(mockBack).not.toHaveBeenCalled();
  });
});
