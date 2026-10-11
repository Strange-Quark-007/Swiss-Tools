import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { LENGTHS } from '@/features/unit-converter/length/utils';
import { testT } from '@/test-helpers/i18n';

import LengthConverterPage, { generateMetadata } from '../../unit-converter/length/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/components/app-layout/app-breadcrumb', () => ({
  AppBreadcrumb: ({ items }: { items: { label: string }[] }) => (
    <nav data-testid="app-breadcrumb">
      {items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}));

vi.mock('@/features/unit-converter/length/length-converter', () => ({
  LengthConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="length-converter" data-from={from} data-to={to} />
  ),
}));

describe('Length converter page (app/unit-converter/length/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for length converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('lengthConverter.meta.title'),
      description: testT('lengthConverter.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await LengthConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.LENGTH_CONVERTER}?from=${LENGTHS.m.value}&to=${LENGTHS.ft.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: LENGTHS.km.value,
      to: LENGTHS.mi.value,
    });
    const jsx = await LengthConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('lengthConverter.name'))).toBeDefined();
    expect(screen.getByText(`${LENGTHS.km.label} ↔ ${LENGTHS.mi.label}`)).toBeDefined();

    const feature = screen.getByTestId('length-converter');
    expect(feature.getAttribute('data-from')).toBe(LENGTHS.km.value);
    expect(feature.getAttribute('data-to')).toBe(LENGTHS.mi.value);
  });
});
