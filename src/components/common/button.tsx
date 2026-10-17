import { ButtonProps } from '@/types/button';

import { withGATracking } from './with-ga-tracking';
import { BaseButton } from '../ui/button';

const TrackedButton = withGATracking(BaseButton);

export const Button = (props: ButtonProps) => {
  if (props.disableTracking) {
    const { disableTracking: _, ...buttonProps } = props;
    return <BaseButton {...buttonProps} />;
  }

  return <TrackedButton {...props} />;
};

export type { ButtonProps };
