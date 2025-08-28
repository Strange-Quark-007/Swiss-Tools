'use client';
import { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Text } from '@/components/typography/text';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export interface Option<ValueType> {
  value: ValueType;
  label: string;
  warning?: string;
}

interface Props<ValueType extends string> {
  type: SEARCH_PARAM_KEYS;
  options: Option<ValueType>[];
  renderExtra?: (currentValue: ValueType) => ReactNode;
}

export function Selector<ValueType extends string>({ type, options, renderExtra }: Props<ValueType>) {
  const t = useT();
  const [value, setValue] = useUrlSearchParams<ValueType>(type);

  const onValueChange = (v: ValueType) => {
    if (v !== value) {
      setValue(v);
    }
  };

  return (
    <FlexContainer direction="col" className="xl:flex-row">
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-40 hover:cursor-pointer">
            <SelectValue placeholder={`Select ${type}...`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.warning && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="pointer-events-auto">
                        <TriangleAlert className="text-red-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      {t(option.warning)}
                    </TooltipContent>
                  </Tooltip>
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
