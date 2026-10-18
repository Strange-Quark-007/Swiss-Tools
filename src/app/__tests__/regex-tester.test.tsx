import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import RegexTesterPage, { generateMetadata } from '../regex-tester/page';

vi.mock('@/features/regex-tester/regex-tester', () => ({
  RegexTester: () => <div data-testid="regex-tester" />,
}));

describe('Regex tester page (app/regex-tester/page.tsx)', () => {
  it('should generate metadata for regex tester page', async () => {
    const metadata = await generateMetadata();

    expect(metadata.title).toBe(testT('regexTester.meta.title'));
    expect(metadata.description).toBe(testT('regexTester.meta.description'));
    expect(metadata.openGraph?.title).toBe(testT('regexTester.meta.title'));
    expect(metadata.twitter?.title).toBe(testT('regexTester.meta.title'));
  });

  it('should render breadcrumb and RegexTester component', async () => {
    const jsx = await RegexTesterPage();
    render(jsx);

    expect(screen.getByTestId('app-breadcrumb')).toBeDefined();
    expect(screen.getByText(testT('regexTester.name'))).toBeDefined();
    expect(screen.getByTestId('regex-tester')).toBeDefined();
  });
});
