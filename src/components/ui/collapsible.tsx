'use client';

import { cn } from 'cn';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

function Collapsible({ className, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn('[&[data-state=closed]]:overflow-visible', className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
