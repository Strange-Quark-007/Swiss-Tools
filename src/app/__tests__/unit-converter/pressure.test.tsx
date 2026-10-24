import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { PRESSURES } from '@/features/unit-converter/pressure/utils';
import { testT } from '@/test-helpers/i18n';

import PressureConverterPage, { generateMetadata } from '../../unit-converter/pressure/page';

vi.mock('@/features/unit-converter/pressure/pressure-converter', () => ({
  PressureConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="pressure-converter" data-from={from} data-to={to} />
  ),
}));

describe('Pressure converter page (app/unit-converter/pressure/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for pressure converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('pressureConverter.meta.title'));
    expect(metadata.description).toBe(testT('pressureConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('pressureConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('pressureConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await PressureConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.PRESSURE_CONVERTER}?from=${PRESSURES.bar.value}&to=${PRESSURES.psi.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: PRESSURES.kpa.value,
      to: PRESSURES.atm.value,
    });
    const jsx = await PressureConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('pressureConverter.name'))).toBeDefined();
    expect(screen.getByText(`${PRESSURES.kpa.label} ↔ ${PRESSURES.atm.label}`)).toBeDefined();

    const feature = screen.getByTestId('pressure-converter');
    expect(feature.getAttribute('data-from')).toBe(PRESSURES.kpa.value);
    expect(feature.getAttribute('data-to')).toBe(PRESSURES.atm.value);
  });
});
