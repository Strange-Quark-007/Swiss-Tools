'use client';
import { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { Text } from '@/components/typography/text';
import { Option } from '@/types/selector';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';

import { TooltipWrapper } from '../common/tooltip-wrapper';

interface Props<ValueType extends string> {
  type: SEARCH_PARAM_KEYS;
  options: Option<ValueType>[];
  className?: string;
  renderExtra?: (currentValue: ValueType) => ReactNode;
}

export function Selector<ValueType extends string>({ type, options, className, renderExtra }: Props<ValueType>) {
  const t = useT();
  const [value, setValue] = useUrlSearchParams<ValueType>(type);

  const onValueChange = (v: ValueType) => {
    if (v !== value) {
      setValue(v);
    }
  };

  return (
    <FlexContainer id="selector" direction="row" className={cn('w-full flex-wrap', className)}>
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-36 hover:cursor-pointer" aria-label={t('selector.placeholder', { type })}>
            <SelectValue placeholder={t('selector.placeholder', { type })} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
                {option.warning && (
                  <TooltipWrapper content={t(option.warning)} contentProps={{ side: 'top', align: 'center' }}>
                    <span className="pointer-events-auto">
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
