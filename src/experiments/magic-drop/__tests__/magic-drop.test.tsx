import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePreferencesStore } from '@/store/preferences-store';

import { MagicDrop } from '../magic-drop';
import { MAGIC_DROP_MIME_TYPE } from '../transfer-data';

const getHandle = (container: HTMLElement) => container.querySelector('button[draggable]') as HTMLButtonElement;

describe('MagicDrop component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePreferencesStore.getState().setLabsFlag('magicDrop', true);
  });

  it('renders null when magicDrop setting is disabled', () => {
    usePreferencesStore.getState().setLabsFlag('magicDrop', false);
    const { container } = render(<MagicDrop value="sample data" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a draggable handle outside the tab order and accessibility tree', () => {
    const { container } = render(<MagicDrop value="sample data" className="custom-test-class" />);

    const button = getHandle(container);
    expect(button).not.toBeNull();
    expect(button.getAttribute('draggable')).toBe('true');
    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(button.getAttribute('aria-hidden')).toBe('true');
    expect(button.hasAttribute('aria-label')).toBe(false);
    expect(button.className).toContain('custom-test-class');
  });

  it('allows pointerdown without preventing default', () => {
    const { container } = render(<MagicDrop value="sample data" />);

    const pointerDownEvent = new MouseEvent('pointerdown', { bubbles: true, cancelable: true });
    getHandle(container).dispatchEvent(pointerDownEvent);

    expect(pointerDownEvent.defaultPrevented).toBe(false);
  });

  it('attaches dataTransfer and creates drag ghost on dragstart with valid data', () => {
    const { container } = render(<MagicDrop value="my-test-payload-12345" />);

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

    getHandle(container).dispatchEvent(dragEvent);
    expect(setDataMock).toHaveBeenCalledWith('text/plain', 'my-test-payload-12345');
    expect(setDataMock).toHaveBeenCalledWith(MAGIC_DROP_MIME_TYPE, 'my-test-payload-12345');
    expect(setDragImageMock).toHaveBeenCalled();
  });

  it('prevents dragstart and does not attach data when the value is empty', () => {
    const { container } = render(<MagicDrop value="   " />);

    const setDataMock = vi.fn();
    const dragEvent = new Event('dragstart', { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.assign(dragEvent, {
      dataTransfer: {
        setData: setDataMock,
        setDragImage: vi.fn(),
        effectAllowed: '',
      },
    });

    getHandle(container).dispatchEvent(dragEvent);

    expect(dragEvent.defaultPrevented).toBe(true);
    expect(setDataMock).not.toHaveBeenCalled();
  });

  it('truncates the drag ghost preview when the value is longer than 24 characters', () => {
    const { container } = render(<MagicDrop value="1234567890123456789012345" />);

    expect(container.textContent).toContain('…');
  });

  it('renders a disabled drag handle when value is empty or only whitespace', () => {
    const { container } = render(<MagicDrop value="   " />);

    const button = getHandle(container);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('draggable')).toBe('false');
  });

  it('blurs the element on click to avoid persistent focus retention', () => {
    const { container } = render(<MagicDrop value="payload" />);

    const button = getHandle(container);
    const blurSpy = vi.spyOn(button, 'blur');

    fireEvent.click(button);
    expect(blurSpy).toHaveBeenCalled();
  });
});
