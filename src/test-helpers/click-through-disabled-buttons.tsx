import { vi } from 'vitest';

import type { ButtonProps } from '@/components/common/button';

const clickThroughState = vi.hoisted(() => ({ active: false }));

// React suppresses click events on disabled buttons, so handler guards that
// repeat the `disabled` prop cannot be reached through the DOM. Tests set
// `clickThroughDisabledButtons.active` before rendering to let clicks reach
// those guards.
export const clickThroughDisabledButtons = clickThroughState;

vi.mock('@/components/common/button', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/common/button')>();

  const ClickThroughDisabledButton = (props: ButtonProps) =>
    clickThroughState.active ? <actual.Button {...props} disabled={false} /> : <actual.Button {...props} />;

  return { ...actual, Button: ClickThroughDisabledButton };
});
