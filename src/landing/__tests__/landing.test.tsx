import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Landing } from '../landing';

vi.mock('../hero', () => ({
  Hero: () => <div data-testid="landing-hero">Mock Hero</div>,
}));

vi.mock('../why-this-toolkit', () => ({
  WhyThisToolkit: () => <div data-testid="landing-why-this-toolkit">Mock WhyThisToolkit</div>,
}));

describe('Landing container component', () => {
  it('should render both Hero and WhyThisToolkit within the flex container layout', () => {
    render(<Landing />);

    expect(screen.getByTestId('landing-hero')).toBeDefined();
    expect(screen.getByTestId('landing-why-this-toolkit')).toBeDefined();
    expect(screen.getByText('Mock Hero')).toBeDefined();
    expect(screen.getByText('Mock WhyThisToolkit')).toBeDefined();
  });
});
