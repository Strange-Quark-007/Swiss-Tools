'use client';
import { Info, TriangleAlert } from 'lucide-react';
import { ReactNode } from 'react';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
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
                {option.info && (
                  <TooltipWrapper content={t(option.info)} contentProps={{ side: 'top', align: 'center' }}>
                    <span className="pointer-events-auto ml-1">
                      <Info className="text-blue-400" />
                    </span>
                  </TooltipWrapper>
                )}
                {option.warning && (
                  <TooltipWrapper content={t(option.warning)} contentProps={{ side: 'top', align: 'center' }}>
                    <span className="pointer-events-auto ml-1">
                      <TriangleAlert className="text-red-400" />
                    </span>
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
