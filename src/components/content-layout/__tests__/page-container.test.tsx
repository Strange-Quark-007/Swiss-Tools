import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

import { PageContainer } from '../page-container';

describe('PageContainer', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render page container with base classes and children', () => {
    render(
      <PageContainer>
        <h1>Page Title</h1>
        <p>Page description</p>
      </PageContainer>
    );

    const container = document.getElementById('page-container');
    expect(container).toBeDefined();
    expect(container?.classList.contains('p-4')).toBe(true);
    expect(container?.classList.contains('flex-col')).toBe(true);
    expect(screen.getByText('Page Title')).toBeDefined();
    expect(screen.getByText('Page description')).toBeDefined();
  });

  it('should merge additional className', () => {
    render(
      <PageContainer className="custom-page-class">
        <span>Content</span>
      </PageContainer>
    );

    const container = document.getElementById('page-container');
    expect(container?.classList.contains('custom-page-class')).toBe(true);
  });
});
