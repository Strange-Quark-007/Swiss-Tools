import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { ColorPicker } from '../color-picker';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackEvent: () => vi.fn(),
}));

describe('ColorPicker', () => {
  it('should render both input and output sections', () => {
    render(<ColorPicker />);

    expect(screen.getByText(`${testT('label.color').toUpperCase()}:`)).toBeDefined();
    expect(screen.getByText(`${testT('label.hex').toUpperCase()}:`)).toBeDefined();
  });
});
