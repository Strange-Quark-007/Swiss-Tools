import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { DATA_SIZES } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const DataSizeSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(DATA_SIZES)} />;
};
