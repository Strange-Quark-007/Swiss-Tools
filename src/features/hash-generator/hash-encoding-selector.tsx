import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { HASH_ENCODINGS } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const HashEncodingSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(HASH_ENCODINGS)} />;
};
