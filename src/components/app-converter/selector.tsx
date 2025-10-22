'use client';
import { CircleX, Info, TriangleAlert } from 'lucide-react';
import { ReactNode } from 'react';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEARCH_PARAM_KEYS, TOOLTIP_TYPE } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';
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

  return (
    <FlexContainer id={`selector-${type}`} direction="row" className={cn('w-full flex-wrap', className)}>
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            className="min-w-40 hover:cursor-pointer custom-transition-color border-ring/50"
            aria-label={t('selector.placeholder', { type })}
          >
            <SelectValue placeholder={t('selector.placeholder', { type })} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="hover:cursor-pointer"
              >
                {option.label}
                {option.tooltip && (
                  <TooltipWrapper
                    content={t(option.tooltip.messageKey)}
                    contentProps={{ side: 'top', align: 'center' }}
                  >
                    <span className="pointer-events-auto ml-1">{iconMap[option.tooltip.type]}</span>
                  </TooltipWrapper>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {renderExtra?.(value)}
    </FlexContainer>
  );
}
