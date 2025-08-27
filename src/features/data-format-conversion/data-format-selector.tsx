import { Selector } from '@/components/content-layout/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { DATA_FORMATS } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const DataFormatSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(DATA_FORMATS)} />;
};
