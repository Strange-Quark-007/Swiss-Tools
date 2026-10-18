import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { WEIGHTS } from '@/features/unit-converter/weight/utils';
import { testT } from '@/test-helpers/i18n';

import WeightConverterPage, { generateMetadata } from '../../unit-converter/weight/page';

vi.mock('@/features/unit-converter/weight/weight-converter', () => ({
  WeightConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="weight-converter" data-from={from} data-to={to} />
  ),
}));

describe('Weight converter page (app/unit-converter/weight/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for weight converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('weightConverter.meta.title'));
    expect(metadata.description).toBe(testT('weightConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('weightConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('weightConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await WeightConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.WEIGHT_CONVERTER}?from=${WEIGHTS.kg.value}&to=${WEIGHTS.lb.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: WEIGHTS.g.value,
      to: WEIGHTS.oz.value,
    });
    const jsx = await WeightConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('weightConverter.name'))).toBeDefined();
    expect(screen.getByText(`${WEIGHTS.g.label} ↔ ${WEIGHTS.oz.label}`)).toBeDefined();

    const feature = screen.getByTestId('weight-converter');
    expect(feature.getAttribute('data-from')).toBe(WEIGHTS.g.value);
    expect(feature.getAttribute('data-to')).toBe(WEIGHTS.oz.value);
  });
});
