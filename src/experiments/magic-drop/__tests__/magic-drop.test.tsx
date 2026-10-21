import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAppStore } from '@/store/app-store';
import { testT } from '@/test-helpers/i18n';

import { MagicDrop } from '../magic-drop';

describe('MagicDrop component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({ magicDrop: true });
  });

  it('renders null when magicDrop setting is disabled', () => {
    useAppStore.setState({ magicDrop: false });
    const { container } = render(<MagicDrop value="sample data" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders draggable button with proper aria-label and styling when enabled', () => {
    render(<MagicDrop value="sample data" className="custom-test-class" />);

    const button = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
    expect(button).toBeDefined();
    expect(button.getAttribute('draggable')).toBe('true');
    expect(button.className).toContain('custom-test-class');
  });

  it('allows pointerdown without preventing default', () => {
    render(<MagicDrop value="sample data" />);

    const button = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
    const pointerDownEvent = new MouseEvent('pointerdown', { bubbles: true, cancelable: true });
    button.dispatchEvent(pointerDownEvent);

    expect(pointerDownEvent.defaultPrevented).toBe(false);
  });

  it('attaches dataTransfer and creates drag ghost on dragstart with valid data', () => {
    render(<MagicDrop value="my-test-payload-12345" />);

    const button = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
    const setDataMock = vi.fn();
    const setDragImageMock = vi.fn();
    const dragEvent = new Event('dragstart', { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.assign(dragEvent, {
      dataTransfer: {
        setData: setDataMock,
        setDragImage: setDragImageMock,
        effectAllowed: '',
      },
    });

    button.dispatchEvent(dragEvent);
    expect(setDataMock).toHaveBeenCalledWith('text/plain', 'my-test-payload-12345');
    expect(setDataMock).toHaveBeenCalledWith('application/x-magic-drop', 'my-test-payload-12345');
    expect(setDragImageMock).toHaveBeenCalled();
  });

  it('prevents dragstart and does not attach data when the value is empty', () => {
    render(<MagicDrop value="   " />);

    const button = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
    const setDataMock = vi.fn();
    const dragEvent = new Event('dragstart', { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.assign(dragEvent, {
      dataTransfer: {
        setData: setDataMock,
        setDragImage: vi.fn(),
        effectAllowed: '',
      },
    });

    button.dispatchEvent(dragEvent);

    expect(dragEvent.defaultPrevented).toBe(true);
    expect(setDataMock).not.toHaveBeenCalled();
  });

  it('truncates the drag ghost preview when the value is longer than 24 characters', () => {
    const { container } = render(<MagicDrop value="1234567890123456789012345" />);

    expect(container.textContent).toContain('…');
  });

  it('renders a disabled drag handle when value is empty or only whitespace', () => {
    render(<MagicDrop value="   " />);

    const button = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('draggable')).toBe('false');
  });

  it('blurs the element on click to avoid persistent focus retention', () => {
    render(<MagicDrop value="payload" />);

    const button = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
    const blurSpy = vi.spyOn(button, 'blur');

    fireEvent.click(button);
    expect(blurSpy).toHaveBeenCalled();
  });
});
