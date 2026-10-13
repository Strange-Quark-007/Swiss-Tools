'use client';
import { cn } from 'cn';
import { CircleX, Info, TriangleAlert } from 'lucide-react';
import { Fragment, ReactNode } from 'react';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
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
import { SEARCH_PARAM_KEYS, TOOLTIP_TYPE } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';
import { Option } from '@/types/selector';

import { TooltipWrapper } from '../common/tooltip-wrapper';

interface Props<ValueType extends string> {
  type: SEARCH_PARAM_KEYS;
  options: Option<ValueType>[];
  className?: string;
  renderExtra?: (currentValue: ValueType) => ReactNode;
}

const iconMap: Record<TOOLTIP_TYPE, ReactNode> = {
  info: <Info className="text-blue-500" />,
  warning: <TriangleAlert className="text-orange-500" />,
  error: <CircleX className="text-red-500" />,
};

export function Selector<ValueType extends string>({ type, options, className, renderExtra }: Props<ValueType>) {
  const { t } = useT();
  const [value, setValue] = useUrlSearchParams<ValueType>(type);

  const onValueChange = (v: ValueType) => {
    if (v !== value) {
      setValue(v);
    }
  };

  const hasGroups = options.some((opt) => !!opt.group);

  const renderOption = (option: Option<ValueType>) => (
    <SelectItem key={option.value} value={option.value} disabled={option.disabled} className="hover:cursor-pointer">
      {option.label}
      {option.tooltip && (
        <TooltipWrapper content={t(option.tooltip.messageKey)} contentProps={{ side: 'top', align: 'center' }}>
          <span className="pointer-events-auto ml-1">{iconMap[option.tooltip.type]}</span>
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
    <FlexContainer id={`selector-${type}`} direction="row" className={cn('w-full flex-wrap', className)}>
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            className="min-w-40 hover:cursor-pointer border-ring/50"
            aria-label={t('selector.placeholder', { type })}
          >
            <SelectValue placeholder={t('selector.placeholder', { type })} />
          </SelectTrigger>
          <SelectContent align="start">{hasGroups ? renderGroupedOptions() : options.map(renderOption)}</SelectContent>
        </Select>
      </div>
      {renderExtra?.(value)}
    </FlexContainer>
  );
}
