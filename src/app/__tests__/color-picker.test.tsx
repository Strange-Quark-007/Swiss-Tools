import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import ColorPickerPage, { generateMetadata } from '../color-picker/page';

vi.mock('@/features/color-picker/color-picker', () => ({
  ColorPicker: () => <div data-testid="color-picker" />,
}));

describe('Color picker page (app/color-picker/page.tsx)', () => {
  it('should generate metadata for color picker page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('colorPicker.meta.title'));
    expect(metadata.description).toBe(testT('colorPicker.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('colorPicker.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('colorPicker.meta.title'));
  });

  it('should render breadcrumb and ColorPicker component', async () => {
    const jsx = await ColorPickerPage();
    render(jsx);

    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('colorPicker.name'))).toBeDefined();
    expect(screen.getByTestId('color-picker')).toBeDefined();
  });
});
