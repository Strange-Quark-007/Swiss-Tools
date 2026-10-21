import { cn } from 'cn';
import { Sparkles } from 'lucide-react';
import React, { useRef } from 'react';

import { Button } from '@/components/common/button';
import { DraggableTooltipTrigger, Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/store';

export interface MagicDropProps {
  value?: string;
  className?: string;
}

export const MagicDrop = ({ value, className }: MagicDropProps) => {
  const { t } = useT();
  const isEnabled = useAppStore((state) => state.magicDrop);
  const dragGhostRef = useRef<HTMLDivElement>(null);
  const trimmedValue = value?.trim() ?? '';
  const hasValue = trimmedValue.length > 0;

  if (!isEnabled) {
    return null;
  }

  const preview = trimmedValue.slice(0, 24);

  const handleDragStart = (e: React.DragEvent<HTMLElement>) => {
    if (!hasValue) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData('text/plain', value!);
    e.dataTransfer.setData('application/x-magic-drop', value!);
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
            variant="ghost"
            size="icon"
            aria-label={t('labs.magicDrop.dragTooltip')}
            className={cn(
              'group max-md:hidden text-primary hover:bg-primary/10 select-none [user-select:none] [-webkit-user-drag:element]',
              hasValue ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50',
              className
            )}
            draggable={hasValue}
            disabled={!hasValue}
            onDragStart={handleDragStart}
          >
            <Sparkles className="size-4 pointer-events-none text-primary group-active:scale-90" />
          </Button>
        </DraggableTooltipTrigger>
        <TooltipContent>{t('labs.magicDrop.dragTooltip')}</TooltipContent>
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
