import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { AREAS } from '@/features/unit-converter/area/utils';
import { testT } from '@/test-helpers/i18n';

import AreaConverterPage, { generateMetadata } from '../../unit-converter/area/page';

vi.mock('@/features/unit-converter/area/area-converter', () => ({
  AreaConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="area-converter" data-from={from} data-to={to} />
  ),
}));

describe('Area converter page (app/unit-converter/area/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for area converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('areaConverter.meta.title'));
    expect(metadata.description).toBe(testT('areaConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('areaConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('areaConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await AreaConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.AREA_CONVERTER}?from=${AREAS.sq_m.value}&to=${AREAS.sq_ft.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: AREAS.sq_km.value,
      to: AREAS.hectare.value,
    });
    const jsx = await AreaConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('areaConverter.name'))).toBeDefined();
    expect(screen.getByText(`${AREAS.sq_km.label} ↔ ${AREAS.hectare.label}`)).toBeDefined();

    const feature = screen.getByTestId('area-converter');
    expect(feature.getAttribute('data-from')).toBe(AREAS.sq_km.value);
    expect(feature.getAttribute('data-to')).toBe(AREAS.hectare.value);
  });
});
