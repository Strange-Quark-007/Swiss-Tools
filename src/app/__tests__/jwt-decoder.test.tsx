import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import JwtDecoderPage, { generateMetadata } from '../jwt-decoder/page';

vi.mock('@/features/jwt-decoder/jwt-decoder', () => ({
  JwtDecoder: () => <div data-testid="jwt-decoder" />,
}));

describe('Jwt decoder page (app/jwt-decoder/page.tsx)', () => {
  it('should generate metadata for jwt decoder page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('jwtDecoder.meta.title'));
    expect(metadata.description).toBe(testT('jwtDecoder.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('jwtDecoder.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('jwtDecoder.meta.title'));
  });

  it('should render breadcrumb and JwtDecoder component', async () => {
    const jsx = await JwtDecoderPage();
    render(jsx);

    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('jwtDecoder.name'))).toBeDefined();
    expect(screen.getByTestId('jwt-decoder')).toBeDefined();
  });
});
