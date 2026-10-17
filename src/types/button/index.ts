import { WithGATrackingProps } from '@/components/common/with-ga-tracking';
import { BaseButtonProps } from '@/components/ui/button';

export interface TrackedButtonProps extends BaseButtonProps, WithGATrackingProps {
  disableTracking?: false;
}

export interface UntrackedButtonProps extends BaseButtonProps {
  disableTracking: true;
  eventName?: never;
  eventParams?: never;
}

export type ButtonProps = TrackedButtonProps | UntrackedButtonProps;
