import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { CASES } from '@/features/case-converter/utils';
import { testT } from '@/test-helpers/i18n';

import TextCaseConverterPage, { generateMetadata } from '../case-converter/page';

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

vi.mock('@/features/case-converter/case-converter', () => ({
  CaseConverter: ({ from, to }: { from: string; to: string }) => (
    <div data-testid="case-converter" data-from={from} data-to={to} />
  ),
}));

describe('Case converter page (app/case-converter/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for case converter page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('caseConverter.meta.title'),
      description: testT('caseConverter.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await TextCaseConverterPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.CASE_CONVERTER}?from=${CASES.lowercase.value}&to=${CASES.uppercase.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      from: CASES.camelcase.value,
      to: CASES.snakecase.value,
    });
    const jsx = await TextCaseConverterPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('caseConverter.name'))).toBeDefined();
    expect(screen.getByText(`${CASES.camelcase.label} ↔ ${CASES.snakecase.label}`)).toBeDefined();

    const feature = screen.getByTestId('case-converter');
    expect(feature.getAttribute('data-from')).toBe(CASES.camelcase.value);
    expect(feature.getAttribute('data-to')).toBe(CASES.snakecase.value);
  });
});
