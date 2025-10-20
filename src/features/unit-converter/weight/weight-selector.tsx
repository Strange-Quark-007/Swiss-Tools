import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { WEIGHTS } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const WeightSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(WEIGHTS)} />;
};
