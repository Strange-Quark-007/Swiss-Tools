import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { LENGTHS } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const LengthSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(LENGTHS)} />;
};
