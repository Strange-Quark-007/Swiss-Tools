import { cn } from 'cn';
import { Sparkles } from 'lucide-react';
import React, { useRef } from 'react';

import { Button } from '@/components/common/button';
import { DraggableTooltipTrigger, Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { useT } from '@/i18n/utils';
import { usePreferencesStore } from '@/store/preferences-store';

import { MAGIC_DROP_MIME_TYPE } from './transfer-data';

export interface MagicDropProps {
  value?: string;
  context?: string;
  className?: string;
}

export const MagicDrop = ({ value, context, className }: MagicDropProps) => {
  const { t } = useT();
  const isEnabled = usePreferencesStore((state) => state.labs.magicDrop);
  const dragGhostRef = useRef<HTMLDivElement>(null);
  const trimmedValue = value?.trim() ?? '';
  const hasValue = trimmedValue.length > 0;

  if (!isEnabled) {
    return null;
  }

  const preview = trimmedValue.slice(0, 24);
  const tooltip = context ? t('labs.magicDrop.dragTooltipContext', { context }) : t('labs.magicDrop.dragTooltip');

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    if (!hasValue) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('text/plain', value!);
    e.dataTransfer.setData(MAGIC_DROP_MIME_TYPE, value!);
    e.dataTransfer.effectAllowed = 'copy';

    // Position badge a tad bit to the right and top relative to cursor
    // (cursor hotspot at bottom-left corner of badge so OS cursor stays below)
    const dragGhost = dragGhostRef.current!;
    const x = 10;
    const y = Math.max(dragGhost.offsetHeight, 28);
    e.dataTransfer.setDragImage(dragGhost, x, y);
  };

  return (
    <>
      <Tooltip>
        <DraggableTooltipTrigger asChild>
          <Button
            disableTracking
            tabIndex={-1}
            variant="ghost"
            size="icon"
            aria-hidden="true"
            className={cn(
              'group max-md:hidden text-primary hover:bg-primary/10 select-none [user-select:none] [-webkit-user-drag:element]',
              hasValue ? 'cursor-grab hover:cursor-grabbing' : 'cursor-not-allowed opacity-50',
              className
            )}
            draggable={hasValue}
            disabled={!hasValue}
            onDragStart={handleDragStart}
          >
            <Sparkles className="size-4 pointer-events-none text-primary group-active:scale-90" />
          </Button>
        </DraggableTooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <div
        ref={dragGhostRef}
        aria-hidden="true"
        className="fixed -top-[1000px] -left-[1000px] pointer-events-none inline-flex items-center gap-2 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl whitespace-nowrap select-none"
      >
        ✨ {preview}
        {trimmedValue.length > 24 ? '…' : ''}
      </div>
    </>
  );
};
