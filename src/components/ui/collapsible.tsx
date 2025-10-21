'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

function Collapsible({ className, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={`${className ?? ''} [&[data-state=closed]]:overflow-visible`}
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
