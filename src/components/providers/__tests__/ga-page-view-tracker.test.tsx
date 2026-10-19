import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useTrackPageView } from '@/hooks/use-ga-events';

import { GAPageViewTracker } from '../ga-page-view-tracker';

describe('GAPageViewTracker', () => {
  it('should call useTrackPageView hook and return null', () => {
    const { container } = render(<GAPageViewTracker />);

    expect(useTrackPageView).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});
