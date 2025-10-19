'use client';

import { ViewTransition } from 'react';

export function ViewTransitionProvider({ children }: { children: React.ReactNode }) {
  return <ViewTransition>{children}</ViewTransition>;
}
