import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { SPEEDS } from '@/features/unit-converter/speed/utils';
import { testT } from '@/test-helpers/i18n';

import SpeedConverterPage, { generateMetadata } from '../../unit-converter/speed/page';

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

vi.mock('@/features/unit-converter/speed/speed-converter', () => ({
  SpeedConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="speed-converter" data-from={from} data-to={to} />
  ),
}));

describe('Speed converter page (app/unit-converter/speed/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for speed converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('speedConverter.meta.title'),
      description: testT('speedConverter.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await SpeedConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.SPEED_CONVERTER}?from=${SPEEDS.kph.value}&to=${SPEEDS.mph.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: SPEEDS.mps.value,
      to: SPEEDS.knot.value,
    });
    const jsx = await SpeedConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('speedConverter.name'))).toBeDefined();
    expect(screen.getByText(`${SPEEDS.mps.label} ↔ ${SPEEDS.knot.label}`)).toBeDefined();

    const feature = screen.getByTestId('speed-converter');
    expect(feature.getAttribute('data-from')).toBe(SPEEDS.mps.value);
    expect(feature.getAttribute('data-to')).toBe(SPEEDS.knot.value);
  });
});
