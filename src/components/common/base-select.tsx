'use client';

import { cn } from 'cn';
import { CircleX, Info, TriangleAlert } from 'lucide-react';
import { Fragment, ReactNode } from 'react';

import { TooltipWrapper } from '@/components/common/tooltip-wrapper';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TOOLTIP_TYPE } from '@/constants/common';
import { useT } from '@/i18n/utils';
import { Option } from '@/types/selector';

export interface BaseSelectProps<ValueType extends string> {
  value?: ValueType;
  defaultValue?: ValueType;
  onValueChange?: (value: ValueType) => void;
  options: Option<ValueType>[];
  placeholder?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  contentAlign?: 'start' | 'center' | 'end';
  contentPosition?: 'popper' | 'item-aligned';
  id?: string;
  disabled?: boolean;
}

const iconMap: Record<TOOLTIP_TYPE, ReactNode> = {
  info: <Info className="text-blue-500" />,
  warning: <TriangleAlert className="text-orange-500" />,
  error: <CircleX className="text-red-500" />,
};

export const BaseSelect = <ValueType extends string>({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  triggerClassName,
  contentAlign = 'start',
  contentPosition,
  id,
  disabled,
}: BaseSelectProps<ValueType>) => {
  const { t } = useT();

  const hasGroups = options.some((opt) => !!opt.group);

  const renderOption = (option: Option<ValueType>) => (
    <SelectItem key={option.value} value={option.value} disabled={option.disabled} className="hover:cursor-pointer">
      {option.label}
      {option.tooltip && (
        <TooltipWrapper content={t(option.tooltip.messageKey)} contentProps={{ side: 'top', align: 'center' }}>
          <span className="pointer-events-auto ml-1 inline-flex items-center">{iconMap[option.tooltip.type]}</span>
        </TooltipWrapper>
      )}
    </SelectItem>
  );

  const renderGroupedOptions = () => {
    const groupMap = new Map<string, Option<ValueType>[]>();

    for (const option of options) {
      const groupName = option.group || '';
      const existing = groupMap.get(groupName);

      if (existing) {
        existing.push(option);
      } else {
        groupMap.set(groupName, [option]);
      }
    }

    const groups = Array.from(groupMap.entries());

    return groups.map(([groupName, items], index) => (
      <Fragment key={groupName || index}>
        {index > 0 && <SelectSeparator />}
        <SelectGroup>
          {groupName && (
            <SelectLabel className="font-semibold text-xs tracking-wider text-muted-foreground">
              {groupName}
            </SelectLabel>
          )}
          {items.map(renderOption)}
        </SelectGroup>
      </Fragment>
    ));
  };

  return (
    <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        className={cn('min-w-40 hover:cursor-pointer border-ring/50', triggerClassName)}
        aria-label={ariaLabel || placeholder}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align={contentAlign} position={contentPosition}>
        {hasGroups ? renderGroupedOptions() : options.map(renderOption)}
      </SelectContent>
    </Select>
  );
};
