import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Landing } from '../landing';

vi.mock('../hero', () => ({
  Hero: () => <div>Mock Hero</div>,
}));

vi.mock('../why-this-toolkit', () => ({
  WhyThisToolkit: () => <div>Mock WhyThisToolkit</div>,
}));

describe('Landing container component', () => {
  it('should render both Hero and WhyThisToolkit within the flex container layout', () => {
    render(<Landing />);

    expect(screen.getByText('Mock Hero')).toBeDefined();
    expect(screen.getByText('Mock WhyThisToolkit')).toBeDefined();
  });
});
