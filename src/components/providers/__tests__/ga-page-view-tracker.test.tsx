import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useTrackPageView } from '@/hooks/use-ga-events';

import { GAPageViewTracker } from '../ga-page-view-tracker';

vi.mock('@/hooks/use-ga-events', () => ({
  useTrackPageView: vi.fn(),
}));

describe('GAPageViewTracker', () => {
  it('should call useTrackPageView hook and return null', () => {
    const { container } = render(<GAPageViewTracker />);

    expect(useTrackPageView).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});
