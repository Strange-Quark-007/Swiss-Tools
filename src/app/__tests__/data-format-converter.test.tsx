import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { DATA_FORMATS } from '@/features/data-format-converter/utils';
import { testT } from '@/test-helpers/i18n';

import DataFormatConverterPage, { generateMetadata } from '../data-format-converter/page';

vi.mock('@/features/data-format-converter/data-format-converter', () => ({
  DataFormatConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="data-format-converter" data-from={from} data-to={to} />
  ),
}));

describe('Data format converter page (app/data-format-converter/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for data format converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('dataFormatConverter.meta.title'));
    expect(metadata.description).toBe(testT('dataFormatConverter.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('dataFormatConverter.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('dataFormatConverter.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await DataFormatConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.DATA_FORMAT_CONVERTER}?from=${DATA_FORMATS.json.value}&to=${DATA_FORMATS.yaml.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: DATA_FORMATS.csv.value,
      to: DATA_FORMATS.json.value,
    });
    const jsx = await DataFormatConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('dataFormatConverter.name'))).toBeDefined();
    expect(screen.getByText(`${DATA_FORMATS.csv.label} ↔ ${DATA_FORMATS.json.label}`)).toBeDefined();

    const feature = screen.getByTestId('data-format-converter');
    expect(feature.getAttribute('data-from')).toBe(DATA_FORMATS.csv.value);
    expect(feature.getAttribute('data-to')).toBe(DATA_FORMATS.json.value);
  });
});
