import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { TIMESTAMP_FORMATS } from '@/features/timestamp-converter/utils';
import { testT } from '@/test-helpers/i18n';

import TimestampConverterPage, { generateMetadata } from '../timestamp-converter/page';

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

vi.mock('@/features/timestamp-converter/timestamp-converter', () => ({
  TimestampConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="timestamp-converter" data-from={from} data-to={to} />
  ),
}));

describe('Timestamp converter page (app/timestamp-converter/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for timestamp converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('timestampConverter.meta.title'));
    expect(metadata.description).toBe(testT('timestampConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('timestampConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('timestampConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await TimestampConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.TIMESTAMP_CONVERTER}?from=${TIMESTAMP_FORMATS.unixSec.value}&to=${TIMESTAMP_FORMATS.iso8601.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: TIMESTAMP_FORMATS.sql.value,
      to: TIMESTAMP_FORMATS.utc.value,
    });
    const jsx = await TimestampConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('timestampConverter.name'))).toBeDefined();
    expect(screen.getByText(`${TIMESTAMP_FORMATS.sql.label} ↔ ${TIMESTAMP_FORMATS.utc.label}`)).toBeDefined();

    const feature = screen.getByTestId('timestamp-converter');
    expect(feature.getAttribute('data-from')).toBe(TIMESTAMP_FORMATS.sql.value);
    expect(feature.getAttribute('data-to')).toBe(TIMESTAMP_FORMATS.utc.value);
  });
});
