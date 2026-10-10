import { describe, it, expect, beforeEach } from 'vitest';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';

import { useColorPickerStore } from '../color-picker-store';

describe('useColorPickerStore', () => {
  beforeEach(() => {
    localStorage.clear();

    useColorPickerStore.setState({
      color: DEFAULT_HSL_COLOR,
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

  it('should persist empty object as settings due to partializeSettings', () => {
    const customColor = { mode: 'hsl' as const, h: 120, s: 0.5, l: 0.4, alpha: 1 };
    useColorPickerStore.setState({
      color: customColor,
    });

    const storedRaw = localStorage.getItem('color-picker');
    expect(storedRaw).not.toBeNull();

    const parsed = JSON.parse(storedRaw!);
    expect(parsed.state).toEqual({});
    expect(parsed.state.color).toBeUndefined();
  });
});
