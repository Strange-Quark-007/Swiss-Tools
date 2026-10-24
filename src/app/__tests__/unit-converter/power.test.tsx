import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { POWERS } from '@/features/unit-converter/power/utils';
import { testT } from '@/test-helpers/i18n';

import PowerConverterPage, { generateMetadata } from '../../unit-converter/power/page';

vi.mock('@/features/unit-converter/power/power-converter', () => ({
  PowerConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="power-converter" data-from={from} data-to={to} />
  ),
}));

describe('Power converter page (app/unit-converter/power/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for power converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('powerConverter.meta.title'));
    expect(metadata.description).toBe(testT('powerConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('powerConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('powerConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await PowerConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(`${ROUTES.POWER_CONVERTER}?from=${POWERS.kw.value}&to=${POWERS.hp.value}`);
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: POWERS.w.value,
      to: POWERS.ps.value,
    });
    const jsx = await PowerConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('unitConverter.name'))).toBeDefined();
    expect(screen.getByText(testT('powerConverter.name'))).toBeDefined();
    expect(screen.getByText(`${POWERS.w.label} ↔ ${POWERS.ps.label}`)).toBeDefined();

    const feature = screen.getByTestId('power-converter');
    expect(feature.getAttribute('data-from')).toBe(POWERS.w.value);
    expect(feature.getAttribute('data-to')).toBe(POWERS.ps.value);
  });
});
