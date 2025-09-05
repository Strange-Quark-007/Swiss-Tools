import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { CASES } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const CaseSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(CASES)} />;
};
