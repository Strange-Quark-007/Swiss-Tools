import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { BASES } from '@/features/number-converter/utils';
import { testT } from '@/test-helpers/i18n';

import NumberConverterPage, { generateMetadata } from '../number-converter/page';

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

vi.mock('@/features/number-converter/number-converter', () => ({
  NumberConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="number-converter" data-from={from} data-to={to} />
  ),
}));

describe('Number converter page (app/number-converter/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for number converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('numberConverter.meta.title'),
      description: testT('numberConverter.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await NumberConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.NUMBER_CONVERTER}?from=${BASES.decimal.value}&to=${BASES.binary.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: BASES.hex.value,
      to: BASES.octal.value,
    });
    const jsx = await NumberConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('numberConverter.name'))).toBeDefined();
    expect(screen.getByText(`${BASES.hex.label} ↔ ${BASES.octal.label}`)).toBeDefined();

    const feature = screen.getByTestId('number-converter');
    expect(feature.getAttribute('data-from')).toBe(BASES.hex.value);
    expect(feature.getAttribute('data-to')).toBe(BASES.octal.value);
  });
});
