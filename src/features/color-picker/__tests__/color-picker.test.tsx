import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { ColorPicker } from '../color-picker';
import { DEFAULT_HSL_COLOR, useColorPickerStore } from '../color-picker-store';
import { formatSwatch } from '../utils';

describe('ColorPicker', () => {
  const mockCanvasRect = (element: HTMLElement) =>
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    });

  beforeEach(() => {
    localStorage.clear();
    useColorPickerStore.setState({
      color: DEFAULT_HSL_COLOR,
      swatches: [],
      editingSwatch: null,
      selectedSwatch: null,
    });
  });

  it('should render input, preview, output, and swatches sections', () => {
    render(<ColorPicker />);

    expect(screen.getByText(`${testT('label.color').toUpperCase()}:`)).toBeDefined();
    expect(screen.getAllByText(`${testT('label.preview').toUpperCase()}:`)[0]).toBeDefined();
    expect(screen.getByText(`${testT('label.hex').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('colorPicker.swatches').toUpperCase()}:`)).toBeDefined();
  });

  it('should call reset on unmount', () => {
    const resetSpy = vi.spyOn(useColorPickerStore.getState(), 'reset');
    const { unmount } = render(<ColorPicker />);

    unmount();

    expect(resetSpy).toHaveBeenCalledTimes(1);
  });

  it('should keep a swatch selected after applying it', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPicker />);

    fireEvent.click(screen.getByLabelText('#112233ff'));

    expect(useColorPickerStore.getState().selectedSwatch).toBe('#112233ff');
  });

  it('should deselect the swatch when the picker is tapped', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    const { container } = render(<ColorPicker />);

    const swatchButton = screen.getByLabelText('#112233ff');
    fireEvent.click(swatchButton);
    swatchButton.focus();

    const selection = container.querySelector('.cursor-crosshair') as HTMLElement;
    mockCanvasRect(selection);
    fireEvent.pointerDown(selection, { clientX: 90, clientY: 50 });

    expect(formatSwatch(useColorPickerStore.getState().color)).not.toBe('#112233ff');
    expect(useColorPickerStore.getState().selectedSwatch).toBeNull();
    expect(document.activeElement).not.toBe(swatchButton);
  });

  it('should keep the swatch selected and in edit mode when the color changes', () => {
    useColorPickerStore.setState({
      swatches: ['#112233ff'],
      editingSwatch: '#112233ff',
      selectedSwatch: '#112233ff',
    });
    const { container } = render(<ColorPicker />);

    const selection = container.querySelector('.cursor-crosshair') as HTMLElement;
    mockCanvasRect(selection);
    fireEvent.pointerDown(selection, { clientX: 90, clientY: 50 });

    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233ff');
    expect(useColorPickerStore.getState().selectedSwatch).toBe('#112233ff');
  });
});
