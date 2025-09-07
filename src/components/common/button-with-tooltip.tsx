import { Button, ButtonProps } from '../ui/button';
import { TooltipWrapper, TooltipWrapperProps } from './tooltip-wrapper';

interface ButtonWithTooltipProps extends ButtonProps {
  tooltip: React.ReactNode;
  contentProps?: TooltipWrapperProps['contentProps'];
  triggerProps?: TooltipWrapperProps['triggerProps'];
}

export const ButtonWithTooltip = ({
  tooltip,
  triggerProps,
  contentProps,
  children,
  ...buttonProps
}: ButtonWithTooltipProps) => {
  return (
    <TooltipWrapper content={tooltip} contentProps={contentProps} triggerProps={triggerProps}>
      <Button {...buttonProps}>{children}</Button>
    </TooltipWrapper>
  );
};
