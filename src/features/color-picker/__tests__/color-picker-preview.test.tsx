import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { testT } from '@/test-helpers/i18n';

import { ColorPickerPreview } from '../color-picker-preview';
import { useColorPickerStore } from '../color-picker-store';

describe('ColorPickerPreview', () => {
  beforeEach(() => {
    useColorPickerStore.setState({ color: DEFAULT_HSL_COLOR });
  });

  it('should render the preview label and box', () => {
    render(<ColorPickerPreview />);

    expect(screen.getByText(`${testT('label.preview').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByTestId('color-picker-preview')).toBeDefined();
  });

  it('should update background gradient when store color updates', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 },
    });

    render(<ColorPickerPreview />);

    const preview = screen.getByTestId('color-picker-preview');
    expect(preview.style.backgroundImage).toContain('rgb');
  });
});
