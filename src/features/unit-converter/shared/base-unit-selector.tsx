import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { Option } from '@/types/selector';

export interface BaseUnitSelectorOptions<T extends string> {
  options: Option<T>[];
}

export interface BaseUnitSelectorProps<T extends string> extends BaseUnitSelectorOptions<T> {
  type: SEARCH_PARAM_KEYS;
}

export const BaseUnitSelector = <T extends string>({ type, options }: BaseUnitSelectorProps<T>) => {
  return <Selector type={type} options={options} />;
};
