import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { SAMPLE } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const SampleSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(SAMPLE)} />;
};
