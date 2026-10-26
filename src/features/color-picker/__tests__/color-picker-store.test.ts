import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_HSL_COLOR, MAX_SWATCHES, useColorPickerStore } from '../color-picker-store';

describe('useColorPickerStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useColorPickerStore.setState({
      color: DEFAULT_HSL_COLOR,
      swatches: [],
    });
  });

  it('should initialize with DEFAULT_HSL_COLOR', () => {
    const state = useColorPickerStore.getState();

    expect(state.color).toEqual(DEFAULT_HSL_COLOR);
  });

  it('should update color via setColor', () => {
    const nextColor = { mode: 'hsl' as const, h: 200, s: 0.8, l: 0.5, alpha: 0.9 };
    useColorPickerStore.getState().setColor(nextColor);

    expect(useColorPickerStore.getState().color).toEqual(nextColor);
  });

  it('should prepend a saved swatch', () => {
    useColorPickerStore.getState().saveSwatch('#112233');
    useColorPickerStore.getState().saveSwatch('#445566');

    expect(useColorPickerStore.getState().swatches).toEqual(['#445566', '#112233']);
  });

  it('should move an existing swatch to the front instead of duplicating it', () => {
    useColorPickerStore.getState().saveSwatch('#112233');
    useColorPickerStore.getState().saveSwatch('#445566');
    useColorPickerStore.getState().saveSwatch('#112233');

    expect(useColorPickerStore.getState().swatches).toEqual(['#112233', '#445566']);
  });

  it('should not allow saving if MAX_SWATCHES is already reached', () => {
    for (let index = 0; index < MAX_SWATCHES; index++) {
      useColorPickerStore.getState().saveSwatch(`#0000${index.toString(16).padStart(2, '0')}`);
    }

    expect(useColorPickerStore.getState().swatches).toHaveLength(MAX_SWATCHES);

    useColorPickerStore.getState().saveSwatch('#ffffff');

    const { swatches } = useColorPickerStore.getState();
    expect(swatches).toHaveLength(MAX_SWATCHES);
    expect(swatches).not.toContain('#ffffff');
  });

  it('should update an existing swatch in place and clear editingSwatch if matched', () => {
    useColorPickerStore.setState({ swatches: ['#112233', '#445566'], editingSwatch: '#112233' });

    useColorPickerStore.getState().updateSwatch('#112233', '#998877');

    expect(useColorPickerStore.getState().swatches).toEqual(['#998877', '#445566']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();

    useColorPickerStore.getState().updateSwatch('#445566', '#223344');
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should dedupe swatches when updating to a value that already exists', () => {
    useColorPickerStore.setState({ swatches: ['#112233', '#445566'], editingSwatch: '#112233' });

    useColorPickerStore.getState().updateSwatch('#112233', '#445566');

    expect(useColorPickerStore.getState().swatches).toEqual(['#445566']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should set and clear editingSwatch explicitly', () => {
    useColorPickerStore.getState().setEditingSwatch('#112233');
    expect(useColorPickerStore.getState().editingSwatch).toBe('#112233');

    useColorPickerStore.getState().setEditingSwatch(null);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();
  });

  it('should set and clear selectedSwatch explicitly', () => {
    useColorPickerStore.getState().setSelectedSwatch('#112233');
    expect(useColorPickerStore.getState().selectedSwatch).toBe('#112233');

    useColorPickerStore.getState().setSelectedSwatch(null);
    expect(useColorPickerStore.getState().selectedSwatch).toBeNull();
  });

  it('should remove a single swatch and clear editingSwatch if matched', () => {
    useColorPickerStore.setState({ swatches: ['#112233', '#445566'], editingSwatch: '#112233' });

    useColorPickerStore.getState().removeSwatch('#112233');

    expect(useColorPickerStore.getState().swatches).toEqual(['#445566']);
    expect(useColorPickerStore.getState().editingSwatch).toBeNull();

    useColorPickerStore.getState().removeSwatch('#445566');
    expect(useColorPickerStore.getState().swatches).toEqual([]);
  });

  it('should clear all swatches', () => {
    useColorPickerStore.setState({ swatches: ['#112233', '#445566'] });

    useColorPickerStore.getState().clearSwatches();

    expect(useColorPickerStore.getState().swatches).toEqual([]);
  });

  it('should persist swatches as settings while keeping the active color in memory', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 120, s: 0.5, l: 0.4, alpha: 1 },
      swatches: ['#112233'],
    });

    const storedRaw = localStorage.getItem('color-picker');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({ swatches: ['#112233'] });
    expect(parsed.state.color).toBeUndefined();
  });

  it('should reset color to DEFAULT_HSL_COLOR while preserving swatches', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 120, s: 0.5, l: 0.4, alpha: 1 },
      swatches: ['#112233'],
      selectedSwatch: '#112233',
    });

    useColorPickerStore.getState().reset();

    expect(useColorPickerStore.getState().color).toEqual(DEFAULT_HSL_COLOR);
    expect(useColorPickerStore.getState().swatches).toEqual(['#112233']);
    expect(useColorPickerStore.getState().selectedSwatch).toBeNull();
  });

  it('should deselect selectedSwatch on setColor when not in edit mode', () => {
    useColorPickerStore.setState({ selectedSwatch: '#112233', editingSwatch: null });

    useColorPickerStore.getState().setColor({ mode: 'hsl', h: 200, s: 0.8, l: 0.5, alpha: 1 });

    expect(useColorPickerStore.getState().selectedSwatch).toBeNull();
  });

  it('should preserve selectedSwatch on setColor when in edit mode', () => {
    useColorPickerStore.setState({ selectedSwatch: '#112233', editingSwatch: '#112233' });

    useColorPickerStore.getState().setColor({ mode: 'hsl', h: 200, s: 0.8, l: 0.5, alpha: 1 });

    expect(useColorPickerStore.getState().selectedSwatch).toBe('#112233');
  });

  it('should clear selectedSwatch when removing the matching swatch', () => {
    useColorPickerStore.setState({ swatches: ['#112233'], selectedSwatch: '#112233' });

    useColorPickerStore.getState().removeSwatch('#112233');

    expect(useColorPickerStore.getState().selectedSwatch).toBeNull();
  });

  it('should update selectedSwatch when updating the matching swatch', () => {
    useColorPickerStore.setState({ swatches: ['#112233'], selectedSwatch: '#112233' });

    useColorPickerStore.getState().updateSwatch('#112233', '#445566');

    expect(useColorPickerStore.getState().selectedSwatch).toBe('#445566');
  });
});
