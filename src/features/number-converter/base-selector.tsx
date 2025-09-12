import dynamic from 'next/dynamic';

import { Selector } from '@/components/app-converter/selector';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { BASES, BaseType, validateCustomBase } from './utils';

const CustomBaseForm = dynamic(() => import('./custom-base-form').then((mod) => mod.default), { ssr: false });

interface Props {
  type: SEARCH_PARAM_KEYS;
  customBase: string;
  onCustomBaseChange?: (value: string) => void;
}

export const BaseSelector = ({ type, customBase, onCustomBaseChange }: Props) => {
  const [base] = useUrlSearchParams<BaseType>(type);

  const handleCustomBaseChange = (value: string) => {
    if (onCustomBaseChange) {
      const validatedValue = validateCustomBase(value);
      onCustomBaseChange(validatedValue);
    }
  };

  return (
    <Selector
      type={type}
      options={Object.values(BASES)}
      renderExtra={() =>
        base === BASES.custom.value && (
          <CustomBaseForm customBase={customBase} onCustomBaseChange={handleCustomBaseChange} />
        )
      }
    />
  );
};
