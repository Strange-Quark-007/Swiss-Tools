'use client';
import { ReactNode } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Text } from '@/components/typography/text';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

export interface Option<ValueType> {
  value: ValueType;
  label: string;
}

interface Props<ValueType extends string> {
  type: SEARCH_PARAM_KEYS;
  options: Option<ValueType>[];
  renderExtra?: (currentValue: ValueType) => ReactNode;
}

export function Selector<ValueType extends string>({ type, options, renderExtra }: Props<ValueType>) {
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
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {renderExtra?.(value)}
    </FlexContainer>
  );
}
