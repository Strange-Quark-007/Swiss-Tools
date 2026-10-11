import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { TEMPERATURES } from '@/features/unit-converter/temperature/utils';
import { testT } from '@/test-helpers/i18n';

import TemperatureConverterPage, { generateMetadata } from '../../unit-converter/temperature/page';

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

vi.mock('@/features/unit-converter/temperature/temperature-converter', () => ({
  TemperatureConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="temperature-converter" data-from={from} data-to={to} />
  ),
}));

describe('Temperature converter page (app/unit-converter/temperature/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for temperature converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('temperatureConverter.meta.title'),
      description: testT('temperatureConverter.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await TemperatureConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.TEMPERATURE_CONVERTER}?from=${TEMPERATURES.c.value}&to=${TEMPERATURES.f.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: TEMPERATURES.k.value,
      to: TEMPERATURES.c.value,
    });
    const jsx = await TemperatureConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('temperatureConverter.name'))).toBeDefined();
    expect(screen.getByText(`${TEMPERATURES.k.label} ↔ ${TEMPERATURES.c.label}`)).toBeDefined();

    const feature = screen.getByTestId('temperature-converter');
    expect(feature.getAttribute('data-from')).toBe(TEMPERATURES.k.value);
    expect(feature.getAttribute('data-to')).toBe(TEMPERATURES.c.value);
  });
});
