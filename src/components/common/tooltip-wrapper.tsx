import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

export interface TooltipWrapperProps {
  children: React.ReactNode;
  content: React.ReactNode;
  triggerProps?: React.ComponentProps<typeof TooltipTrigger>;
  contentProps?: React.ComponentProps<typeof TooltipContent>;
}

export const TooltipWrapper = ({ children, content, triggerProps, contentProps }: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger {...triggerProps} asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent {...contentProps}>{content}</TooltipContent>
    </Tooltip>
  );
};
