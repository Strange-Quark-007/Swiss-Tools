import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { HASH_ENCODINGS, HASHING_ALGOS } from '@/features/hash-generator/utils';
import { testT } from '@/test-helpers/i18n';

import HashGeneratorPage, { generateMetadata } from '../hash-generator/page';

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

vi.mock('@/features/hash-generator/hash-generator', () => ({
  HashGenerator: ({ algo, encoding }: { algo: string; encoding: string }) => (
    <div data-testid="hash-generator" data-algo={algo} data-encoding={encoding} />
  ),
}));

describe('Hash generator page (app/hash-generator/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for hash generator page', async () => {
    const metadata = await generateMetadata();

    expect(metadata).toEqual({
      title: testT('hashGenerator.meta.title'),
      description: testT('hashGenerator.meta.description'),
    });
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await HashGeneratorPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.HASH_GENERATOR}?algo=${HASHING_ALGOS.sha256.value}&encoding=${HASH_ENCODINGS.hex.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      algo: HASHING_ALGOS.md5.value,
      encoding: HASH_ENCODINGS.base64.value,
    });
    const jsx = await HashGeneratorPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('hashGenerator.name'))).toBeDefined();
    expect(screen.getByText(`${HASHING_ALGOS.md5.label} (${HASH_ENCODINGS.base64.label})`)).toBeDefined();

    const feature = screen.getByTestId('hash-generator');
    expect(feature.getAttribute('data-algo')).toBe(HASHING_ALGOS.md5.value);
    expect(feature.getAttribute('data-encoding')).toBe(HASH_ENCODINGS.base64.value);
  });
});
