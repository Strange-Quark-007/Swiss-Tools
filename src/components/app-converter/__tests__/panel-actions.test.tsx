import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { PanelActions } from '../panel-actions';

describe('PanelActions', () => {
  const mockOnSample = vi.fn();
  const mockOnUpload = vi.fn();
  const mockOnCopy = vi.fn();
  const mockOnClear = vi.fn();
  const mockOnDownload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render editable actions: sample, upload, copy, and clear buttons', () => {
    render(
      <PanelActions
        readOnly={false}
        onSample={mockOnSample}
        onUpload={mockOnUpload}
        onCopy={mockOnCopy}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByRole('button', { name: testT('label.sampleData') })).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.upload') })).toBeDefined();
    expect(
      screen.getByRole('button', {
        name: testT('aria.copyContext', { context: testT('label.input') }),
      })
    ).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.clear') })).toBeDefined();
    // Download should not be rendered when readOnly is false
    expect(screen.queryByRole('button', { name: testT('label.download') })).toBeNull();
  });

  it('should render readOnly actions: copy and download buttons', () => {
    render(<PanelActions readOnly={true} onCopy={mockOnCopy} onDownload={mockOnDownload} />);

    expect(
      screen.getByRole('button', {
        name: testT('aria.copyContext', { context: testT('label.result') }),
      })
    ).toBeDefined();
    expect(screen.getByRole('button', { name: testT('label.download') })).toBeDefined();

    expect(screen.queryByRole('button', { name: testT('label.sampleData') })).toBeNull();
    expect(screen.queryByRole('button', { name: testT('label.upload') })).toBeNull();
    expect(screen.queryByRole('button', { name: testT('label.clear') })).toBeNull();
  });

  it('should use custom copyContext when provided', () => {
    render(<PanelActions readOnly={false} copyContext="custom-payload" onCopy={mockOnCopy} />);

    expect(
      screen.getByRole('button', {
        name: testT('aria.copyContext', { context: 'custom-payload' }),
      })
    ).toBeDefined();
  });

  it('should trigger onCopy and toggle check icon for 1500ms', () => {
    render(<PanelActions readOnly={false} onCopy={mockOnCopy} />);

    const copyBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.input') }),
    });

    fireEvent.click(copyBtn);
    expect(mockOnCopy).toHaveBeenCalledTimes(1);

    // Fast forward 1500ms timer
    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });

  it('should trigger onSample, onUpload, onClear, and onDownload callbacks', () => {
    const { rerender } = render(
      <PanelActions readOnly={false} onSample={mockOnSample} onUpload={mockOnUpload} onClear={mockOnClear} />
    );

    fireEvent.click(screen.getByRole('button', { name: testT('label.sampleData') }));
    expect(mockOnSample).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: testT('label.upload') }));
    expect(mockOnUpload).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: testT('label.clear') }));
    expect(mockOnClear).toHaveBeenCalledTimes(1);

    rerender(<PanelActions readOnly={true} onDownload={mockOnDownload} />);

    fireEvent.click(screen.getByRole('button', { name: testT('label.download') }));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });

  describe('magicDrop drag handle', () => {
    it('should allow dragging when value is present and not prevent pointerdown', async () => {
      const { useAppStore } = await import('@/store/store');
      useAppStore.setState({ magicDrop: true });

      render(<PanelActions readOnly={false} value="test-json-data" />);

      const dragHandle = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
      expect(dragHandle).toBeDefined();
      expect(dragHandle.getAttribute('draggable')).toBe('true');

      // pointerdown should not be cancelled/prevented
      const pointerDownEvent = new MouseEvent('pointerdown', { bubbles: true, cancelable: true });
      dragHandle.dispatchEvent(pointerDownEvent);
      expect(pointerDownEvent.defaultPrevented).toBe(false);

      // dragstart with valid data
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

      dragHandle.dispatchEvent(dragEvent);
      expect(setDataMock).toHaveBeenCalledWith('text/plain', 'test-json-data');
      expect(setDataMock).toHaveBeenCalledWith('application/x-magic-drop', 'test-json-data');

      // Reset store
      useAppStore.setState({ magicDrop: false });
    });

    it('should render a disabled drag handle when value is empty', async () => {
      const { useAppStore } = await import('@/store/store');
      useAppStore.setState({ magicDrop: true });

      render(<PanelActions readOnly={false} value="" />);

      const dragHandle = screen.getByRole('button', {
        name: testT('labs.magicDrop.dragTooltip'),
      }) as HTMLButtonElement;
      expect(dragHandle.disabled).toBe(true);
      expect(dragHandle.getAttribute('draggable')).toBe('false');

      // Reset store
      useAppStore.setState({ magicDrop: false });
    });

    it('should hide the drag handle when magic drop is not supported', async () => {
      const { useAppStore } = await import('@/store/store');
      useAppStore.setState({ magicDrop: true });

      render(<PanelActions readOnly={false} value="data" supportsMagicDrop={false} />);

      expect(screen.queryByRole('button', { name: testT('labs.magicDrop.dragTooltip') })).toBeNull();

      // Reset store
      useAppStore.setState({ magicDrop: false });
    });

    it('should blur on click to avoid persistent tooltip focus', async () => {
      const { useAppStore } = await import('@/store/store');
      useAppStore.setState({ magicDrop: true });

      render(<PanelActions readOnly={false} value="data" />);

      const dragHandle = screen.getByRole('button', { name: testT('labs.magicDrop.dragTooltip') });
      const blurSpy = vi.spyOn(dragHandle, 'blur');

      fireEvent.click(dragHandle);
      expect(blurSpy).toHaveBeenCalled();

      // Reset store
      useAppStore.setState({ magicDrop: false });
    });
  });
});
