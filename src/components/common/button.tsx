import { withGATracking, WithGATrackingProps } from './with-ga-tracking';
import { ButtonBase, ButtonBaseProps } from '../ui/button';

export interface ButtonProps extends ButtonBaseProps, WithGATrackingProps {}

export const Button = withGATracking(ButtonBase);
