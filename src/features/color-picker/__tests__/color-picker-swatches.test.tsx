import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { testT } from '@/test-helpers/i18n';

import { useColorPickerStore } from '../color-picker-store';
import { ColorPickerSwatches } from '../color-picker-swatches';
import { formatSwatch } from '../utils';

describe('ColorPickerSwatches', () => {
  beforeEach(() => {
    localStorage.clear();
    useColorPickerStore.setState({
      color: DEFAULT_HSL_COLOR,
      swatches: [],
      editingSwatch: null,
      selectedSwatch: null,
    });
  });

  it('should render the swatches heading', () => {
    render(<ColorPickerSwatches />);

    expect(screen.getByText(`${testT('colorPicker.swatches').toUpperCase()}:`)).toBeDefined();
  });

  it('should show the hex code for a swatch', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    expect(screen.getByText('#112233')).toBeDefined();
  });

  it('should apply a saved swatch to the active color', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText('#112233ff'));

    expect(formatSwatch(useColorPickerStore.getState().color)).toBe('#112233ff');
  });

  it('should ignore a swatch that cannot be parsed', () => {
    useColorPickerStore.setState({ swatches: ['not-a-color'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText('not-a-color'));

    expect(useColorPickerStore.getState().color).toEqual(DEFAULT_HSL_COLOR);
  });

  it('should remove a single swatch', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff', '#445566ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.removeSwatch')}: #112233ff`));

    expect(useColorPickerStore.getState().swatches).toEqual(['#445566ff']);
  });

  it('should clear every swatch at once', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff', '#445566ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByText(testT('label.clearAll')));

    expect(useColorPickerStore.getState().swatches).toEqual([]);
  });

  it('should hide the clear action when no swatches are saved', () => {
    render(<ColorPickerSwatches />);

    expect(screen.queryByText(testT('label.clearAll'))).toBeNull();
  });

  it('should load swatch into palette and set editing state on edit click', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233ff');
    expect(formatSwatch(useColorPickerStore.getState().color)).toBe('#112233ff');
  });

  it('should handle unparseable swatch on edit click', () => {
    useColorPickerStore.setState({ swatches: ['not-a-color'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: not-a-color`));

    expect(useColorPickerStore.getState().editingSwatch).toBe('not-a-color');
    expect(useColorPickerStore.getState().color).toEqual(DEFAULT_HSL_COLOR);
  });

  it('should save inline text edits on Enter key', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'a' });
    fireEvent.change(input, { target: { value: '#ff0000' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(useColorPickerStore.getState().swatches).toEqual(['#ff0000ff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should save inline text edits from the direct save button', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    fireEvent.change(input, { target: { value: '#00ff00' } });
    fireEvent.click(screen.getByLabelText(testT('colorPicker.saveSwatch')));

    expect(useColorPickerStore.getState().swatches).toEqual(['#00ff00ff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should cancel inline editing on Escape key', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    fireEvent.change(input, { target: { value: '#0000ff' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(useColorPickerStore.getState().swatches).toEqual(['#112233ff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should ignore unparseable draft color when typing', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    fireEvent.change(input, { target: { value: 'not-valid' } });

    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233ff');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should save directly from the card save button without typing manual draft', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));
    useColorPickerStore.setState({ color: { mode: 'hsl', h: 180, s: 1, l: 0.5, alpha: 1 } });
    fireEvent.click(screen.getByLabelText(testT('colorPicker.saveSwatch')));

    expect(useColorPickerStore.getState().swatches).toEqual(['#00ffffff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should hide the remove button when a swatch is being edited', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'], editingSwatch: '#112233ff' });
    render(<ColorPickerSwatches />);

    expect(screen.queryByLabelText(`${testT('colorPicker.removeSwatch')}: #112233ff`)).toBeNull();
  });

  it('should render the remove button when a swatch is selected so it shows on hover', () => {
    const selectedSwatch = formatSwatch(DEFAULT_HSL_COLOR);
    useColorPickerStore.setState({ swatches: [selectedSwatch] });
    render(<ColorPickerSwatches />);

    expect(screen.getByLabelText(`${testT('colorPicker.removeSwatch')}: ${selectedSwatch}`)).toBeDefined();
  });

  it('should cancel inline editing when clicking the cancel button', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));
    fireEvent.click(screen.getByLabelText(testT('colorPicker.cancelEdit')));

    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should commit on blur when focus leaves the card with a valid color', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    fireEvent.change(input, { target: { value: '#00ff00ff' } });

    const card = input.closest('div[class*="rounded"]')!;
    fireEvent.blur(card, { relatedTarget: null });

    expect(useColorPickerStore.getState().swatches).toEqual(['#00ff00ff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should cancel on blur when focus leaves the card with an invalid draft', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    fireEvent.change(input, { target: { value: 'not-a-color' } });

    const card = input.closest('div[class*="rounded"]')!;
    fireEvent.blur(card, { relatedTarget: null });

    expect(useColorPickerStore.getState().swatches).toEqual(['#112233ff']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should not blur when focus moves to another element inside the card', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));

    const input = screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` });
    const card = input.closest('div[class*="rounded"]')!;
    const saveButton = screen.getByLabelText(testT('colorPicker.saveSwatch'));

    fireEvent.blur(card, { relatedTarget: saveButton });

    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233ff');
  });

  it('should copy hex code to clipboard when copy button is clicked', () => {
    vi.useFakeTimers();
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(testT('aria.copyContext', { context: '#112233' })));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#112233');

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    vi.useRealTimers();
  });

  it('should show active color tray when a swatch is selected and auto-deselect when color changes', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    const { rerender } = render(<ColorPickerSwatches />);

    // Select the swatch
    fireEvent.click(screen.getByLabelText('#112233ff'));
    expect(formatSwatch(useColorPickerStore.getState().color)).toBe('#112233ff');

    const tray = screen.getByText('#112233').closest('div[class*="transition-transform"]')!;
    expect(tray.className).toContain('translate-y-0');

    // Change color (not in edit mode) -> should auto-deselect the swatch and hide the tray
    act(() => {
      useColorPickerStore.getState().setColor({ mode: 'hsl', h: 100, s: 0.5, l: 0.5, alpha: 1 });
    });
    rerender(<ColorPickerSwatches />);

    expect(tray.className).toContain('translate-y-full');
  });

  it('should not deselect or exit edit mode when color changes in edit mode', () => {
    useColorPickerStore.setState({ swatches: ['#112233ff'] });
    const { rerender } = render(<ColorPickerSwatches />);

    fireEvent.click(screen.getByLabelText(`${testT('colorPicker.editSwatch')}: #112233ff`));
    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233ff');

    act(() => {
      useColorPickerStore.getState().setColor({ mode: 'hsl', h: 200, s: 0.8, l: 0.4, alpha: 1 });
    });
    rerender(<ColorPickerSwatches />);

    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233ff');
    expect(screen.getByRole('textbox', { name: `${testT('colorPicker.editSwatch')}: #112233ff` })).toBeDefined();
  });
});
