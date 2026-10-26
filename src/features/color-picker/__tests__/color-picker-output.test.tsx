import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_HSL_COLOR } from '@/components/ui/shadcn-io/color-picker';
import { testT } from '@/test-helpers/i18n';

import { ColorPickerOutput } from '../color-picker-output';
import { useColorPickerStore } from '../color-picker-store';
import * as utils from '../utils';

vi.mock('../utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils')>();
  return {
    ...actual,
    convertColor: vi.fn(actual.convertColor),
  };
});

describe('ColorPickerOutput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useColorPickerStore.setState({ color: DEFAULT_HSL_COLOR });
  });

  it('should render all color format outputs and copy hex', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 0, s: 1, l: 0.5, alpha: 1 },
    });

    render(<ColorPickerOutput />);

    expect(screen.getByText(`${testT('label.hex').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.rgba').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.hsl').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.oklch').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.argb').toUpperCase()}:`)).toBeDefined();

    const copyHexBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.hex') }),
    });
    fireEvent.click(copyHexBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#ff0000ff');
  });

  it('should handle copying rgba, hsl, oklch, and argb', () => {
    useColorPickerStore.setState({
      color: { mode: 'hsl', h: 120, s: 1, l: 0.5, alpha: 0.5 },
    });

    render(<ColorPickerOutput />);

    const copyRgbaBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.rgba') }),
    });
    fireEvent.click(copyRgbaBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    const copyHslBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.hsl') }),
    });
    fireEvent.click(copyHslBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    const copyOklchBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.oklch') }),
    });
    fireEvent.click(copyOklchBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('oklch('));

    const copyArgbBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.argb') }),
    });
    fireEvent.click(copyArgbBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-fA-F]{8}$/));
  });

  it('should handle missing alpha and optional oklch channels gracefully', () => {
    vi.mocked(utils.convertColor).mockReturnValueOnce({
      rgb: { mode: 'rgb', r: 0, g: 0, b: 0 },
      hsl: { mode: 'hsl', h: 0, s: 0, l: 0 },
      oklch: { mode: 'oklch', l: 0, c: 0 },
    });

    render(<ColorPickerOutput />);

    const copyOklchBtn = screen.getByRole('button', {
      name: testT('aria.copyContext', { context: testT('label.oklch') }),
    });
    fireEvent.click(copyOklchBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('oklch(0 0 0 / 1)');
  });
});
