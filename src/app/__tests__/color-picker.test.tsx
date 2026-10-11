import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import ColorPickerPage, { generateMetadata } from '../color-picker/page';

vi.mock('@/components/app-layout/app-breadcrumb', () => ({
  AppBreadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="app-breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

vi.mock('@/features/color-picker/color-picker', () => ({
  ColorPicker: () => <div data-testid="color-picker" />,
}));

describe('Color picker page (app/color-picker/page.tsx)', () => {
  it('should generate metadata for color picker page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('colorPicker.meta.title'),
      description: testT('colorPicker.meta.description'),
    });
  });

  it('should render breadcrumb and ColorPicker component', async () => {
    const jsx = await ColorPickerPage();
    render(jsx);

    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('colorPicker.name'))).toBeDefined();
    expect(screen.getByTestId('color-picker')).toBeDefined();
  });
});
