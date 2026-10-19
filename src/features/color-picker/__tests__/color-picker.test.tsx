import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { ColorPicker } from '../color-picker';
import { useColorPickerStore } from '../color-picker-store';

describe('ColorPicker', () => {
  it('should render both input and output sections', () => {
    render(<ColorPicker />);

    expect(screen.getByText(`${testT('label.color').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.hex').toUpperCase()}:`)).toBeDefined();
  });

  it('should call reset on unmount', () => {
    const resetSpy = vi.spyOn(useColorPickerStore.getState(), 'reset');
    const { unmount } = render(<ColorPicker />);

    unmount();

    expect(resetSpy).toHaveBeenCalledTimes(1);
  });
});
