import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { VOLUMES } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const VolumeSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(VOLUMES)} />;
};
