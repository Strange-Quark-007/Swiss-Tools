'use client';

import { cn } from 'cn';
import { ReactNode } from 'react';

import { BaseSelect } from '@/components/common/base-select';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { useT } from '@/i18n/utils';
import { Option } from '@/types/selector';

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
        <BaseSelect
          value={value}
          options={options}
          onValueChange={onValueChange}
          placeholder={t('selector.placeholder', { type })}
          ariaLabel={t('selector.placeholder', { type })}
        />
      </div>
      {renderExtra?.(value)}
    </FlexContainer>
  );
}
