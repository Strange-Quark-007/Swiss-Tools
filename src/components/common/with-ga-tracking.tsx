'use client';
import { ComponentType, MouseEventHandler } from 'react';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useTrackEvent } from '@/hooks/use-ga-events';

export interface WithGATrackingProps {
  eventName: GA_EVENTS;
  eventParams?: Record<string, unknown>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const withGATracking = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithTracking = (props: P & WithGATrackingProps) => {
    const { eventName, eventParams = {}, onClick, ...rest } = props;
    const trackEvent = useTrackEvent();

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      trackEvent(eventName, eventParams);
      onClick?.(e);
    };

    return <WrappedComponent {...(rest as P)} onClick={handleClick} />;
  };

  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithTracking.displayName = `withGATracking(${wrappedName})`;

  return ComponentWithTracking;
};
