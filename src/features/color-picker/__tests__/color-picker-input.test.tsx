import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { testT } from '@/test-helpers/i18n';

import { ColorPickerInput } from '../color-picker-input';
import { MAX_SWATCHES, useColorPickerStore } from '../color-picker-store';
import { formatColorInput, formatSwatch } from '../utils';

describe('ColorPickerInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useColorPickerStore.setState({ color: DEFAULT_HSL_COLOR, swatches: [] });
  });

  it('should render color picker label and custom color input', () => {
    render(<ColorPickerInput />);

    expect(screen.getByText(`${testT('label.color').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByLabelText(testT('label.custom'))).toBeDefined();
  });

  it('should show the current color in the custom color field', () => {
    render(<ColorPickerInput />);

    const input = screen.getByLabelText(testT('label.custom')) as HTMLInputElement;
    expect(input.value).toBe(formatColorInput(DEFAULT_HSL_COLOR));
    expect(input.value).toBe('#ffffff');
  });

  it('should update the store when a valid color is typed', () => {
    render(<ColorPickerInput />);

    const input = screen.getByLabelText(testT('label.custom'));
    fireEvent.change(input, { target: { value: '#ff0000' } });

    expect(formatSwatch(useColorPickerStore.getState().color)).toBe('#ff0000ff');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('should apply alpha from an 8-digit hex value', () => {
    render(<ColorPickerInput />);

    const input = screen.getByLabelText(testT('label.custom')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '#ff000080' } });

    expect(useColorPickerStore.getState().color.alpha).toBeCloseTo(0.502, 3);

    fireEvent.blur(input);
    expect(input.value).toBe('#ff000080');
  });

  it('should reject an invalid color without touching the store', () => {
    render(<ColorPickerInput />);

    const input = screen.getByLabelText(testT('label.custom'));
    fireEvent.change(input, { target: { value: '#zzz' } });

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(useColorPickerStore.getState().color).toEqual(DEFAULT_HSL_COLOR);
  });

  it('should clear the draft and validation state on blur', () => {
    render(<ColorPickerInput />);

    const input = screen.getByLabelText(testT('label.custom')) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'not-a-color' } });
    fireEvent.blur(input);

    expect(input.value).toBe(formatColorInput(DEFAULT_HSL_COLOR));
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('should save the active color as a swatch from the header action', () => {
    useColorPickerStore.setState({ color: { mode: 'hsl', h: 210, s: 1, l: 0.5, alpha: 1 } });
    render(<ColorPickerInput />);

    fireEvent.click(screen.getByLabelText(testT('colorPicker.saveSwatch')));

    expect(useColorPickerStore.getState().swatches).toEqual([formatSwatch(useColorPickerStore.getState().color)]);
  });

  it('should update an existing swatch when in edit mode from the save action', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 },
      swatches: ['#112233ff'],
      editingSwatch: '#112233ff',
    });
    render(<ColorPickerInput />);

    fireEvent.click(screen.getByLabelText(testT('colorPicker.updateSwatch')));

    expect(useColorPickerStore.getState().swatches).toEqual(['#ff0000ff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should cancel edit mode when clicking the header cancel button', () => {
    useColorPickerStore.setState({
      swatches: ['#112233ff'],
      editingSwatch: '#112233ff',
    });
    render(<ColorPickerInput />);

    fireEvent.click(screen.getByLabelText(testT('colorPicker.cancelEdit')));
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should disable saving when MAX_SWATCHES is already reached and not in edit mode', () => {
    const swatches = Array.from({ length: MAX_SWATCHES }, (_, index) => `#0000${index.toString(16).padStart(2, '0')}`);
    useColorPickerStore.setState({ swatches });
    render(<ColorPickerInput />);

    const saveButton = screen.getByLabelText(testT('colorPicker.saveSwatch'));
    expect(saveButton.hasAttribute('disabled')).toBe(true);

    fireEvent.click(saveButton);
    expect(useColorPickerStore.getState().swatches).toHaveLength(MAX_SWATCHES);
  });

  it('should lower alpha when the alpha slider is nudged left', () => {
    render(<ColorPickerInput />);

    const alphaSlider = screen.getAllByRole('slider')[1];
    fireEvent.keyDown(alphaSlider, { key: 'ArrowLeft' });

    expect(useColorPickerStore.getState().color.alpha).toBeCloseTo(0.99, 2);
  });

  it('should clear the selected swatch on picker pointerdown when nothing is focused', () => {
    useColorPickerStore.setState({ selectedSwatch: '#112233ff' });
    const { container } = render(<ColorPickerInput />);
    const activeElementSpy = vi.spyOn(document, 'activeElement', 'get').mockReturnValue(null);

    fireEvent.pointerDown(container.querySelector('.cursor-crosshair') as HTMLElement, {
      clientX: 50,
      clientY: 50,
    });
    activeElementSpy.mockRestore();

    expect(useColorPickerStore.getState().selectedSwatch).toBeNull();
  });
});
