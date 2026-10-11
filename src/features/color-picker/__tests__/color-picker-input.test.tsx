import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { testT } from '@/test-helpers/i18n';

import { ColorPickerInput } from '../color-picker-input';
import { useColorPickerStore } from '../color-picker-store';

describe('ColorPickerInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useColorPickerStore.setState({ color: DEFAULT_HSL_COLOR });
  });

  it('should render color picker labels and preview element', () => {
    render(<ColorPickerInput />);

    expect(screen.getByText(`${testT('label.color').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.preview').toUpperCase()}:`)).toBeDefined();
  });

  it('should update background gradient when store color updates', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 },
    });

    const { container } = render(<ColorPickerInput />);

    const preview = container.querySelector('.size-48');
    expect(preview).toBeDefined();
    expect((preview as HTMLElement).style.backgroundImage).toContain('rgb');
  });
});
