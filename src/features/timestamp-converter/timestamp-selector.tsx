import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { TIMESTAMP_FORMATS } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const TimestampSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(TIMESTAMP_FORMATS)} />;
};
