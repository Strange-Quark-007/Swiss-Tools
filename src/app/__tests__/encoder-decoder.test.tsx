import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { CODECS, MODES } from '@/features/encoder-decoder/utils';
import { testT } from '@/test-helpers/i18n';

import EncoderDecoderPage, { generateMetadata } from '../encoder-decoder/page';

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

vi.mock('@/features/encoder-decoder/encoder-decoder', () => ({
  EncoderDecoder: ({ codec, mode }: { codec: string; mode: string }) => (
    <div data-testid="encoder-decoder" data-codec={codec} data-mode={mode} />
  ),
}));

describe('Encoder decoder page (app/encoder-decoder/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate metadata for encoder decoder page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('encoderDecoder.meta.title'));
    expect(metadata.description).toBe(testT('encoderDecoder.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('encoderDecoder.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('encoderDecoder.meta.title'));
  });

  it('should redirect to canonical URL when search params are missing', async () => {
    const searchParams = Promise.resolve({});
    await EncoderDecoderPage({ searchParams });

    expect(redirect).toHaveBeenCalledWith(
      `${ROUTES.ENCODER_DECODER}?codec=${CODECS.base64.value}&mode=${MODES.encode.value}`
    );
  });

  it('should render with validated custom query params without redirecting', async () => {
    const searchParams = Promise.resolve({
      codec: CODECS.url.value,
      mode: MODES.decode.value,
    });
    const jsx = await EncoderDecoderPage({ searchParams });
    render(jsx);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('encoderDecoder.name'))).toBeDefined();
    expect(screen.getByText(`${MODES.decode.value.toUpperCase()} (${CODECS.url.label})`)).toBeDefined();

    const feature = screen.getByTestId('encoder-decoder');
    expect(feature.getAttribute('data-codec')).toBe(CODECS.url.value);
    expect(feature.getAttribute('data-mode')).toBe(MODES.decode.value);
  });
});
