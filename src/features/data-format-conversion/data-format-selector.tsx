import { ConversionType } from '@/types/common';
import { Selector } from '@/components/content-layout/selector';

import { DATA_FORMATS } from './utils';

interface Props {
  type: ConversionType;
}

export const DataFormatSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(DATA_FORMATS)} />;
};
