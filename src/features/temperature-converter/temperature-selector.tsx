import { Selector } from '@/components/app-converter/selector';
import { SEARCH_PARAM_KEYS } from '@/constants/common';

import { TEMPERATURES } from './utils';

interface Props {
  type: SEARCH_PARAM_KEYS;
}

export const TemperatureSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(TEMPERATURES)} />;
};
