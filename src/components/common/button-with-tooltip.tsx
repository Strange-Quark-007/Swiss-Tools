import { Button, ButtonProps } from './button';
import { TooltipWrapper, TooltipWrapperProps } from './tooltip-wrapper';

interface ButtonWithTooltipProps extends ButtonProps {
  ariaLabel: string;
  tooltip: React.ReactNode;
  contentProps?: TooltipWrapperProps['contentProps'];
  triggerProps?: TooltipWrapperProps['triggerProps'];
}

export const ButtonWithTooltip = ({
  type = 'button',
  ariaLabel,
  tooltip,
  triggerProps,
  contentProps,
  children,
  ...buttonProps
}: ButtonWithTooltipProps) => {
  return (
    <TooltipWrapper content={tooltip} contentProps={contentProps} triggerProps={triggerProps}>
      <Button type={type} aria-label={ariaLabel} {...buttonProps}>
        {children}
      </Button>
    </TooltipWrapper>
  );
};
