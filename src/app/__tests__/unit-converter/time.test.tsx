import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { TIMES } from '@/features/unit-converter/time/utils';
import { testT } from '@/test-helpers/i18n';

import TimeConverterPage, { generateMetadata } from '../../unit-converter/time/page';

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

vi.mock('@/features/unit-converter/time/time-converter', () => ({
  TimeConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="time-converter" data-from={from} data-to={to} />
  ),
}));

describe('Time converter page (app/unit-converter/time/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for time converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('timeConverter.meta.title'),
      description: testT('timeConverter.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await TimeConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.TIME_CONVERTER}?from=${TIMES.s.value}&to=${TIMES.min.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: TIMES.h.value,
      to: TIMES.d.value,
    });
    const jsx = await TimeConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('timeConverter.name'))).toBeDefined();
    expect(screen.getByText(`${TIMES.h.label} ↔ ${TIMES.d.label}`)).toBeDefined();

    const feature = screen.getByTestId('time-converter');
    expect(feature.getAttribute('data-from')).toBe(TIMES.h.value);
    expect(feature.getAttribute('data-to')).toBe(TIMES.d.value);
  });
});
