import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { HASHING_ALGOS } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const HashAlgoSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(HASHING_ALGOS)} />;
};
