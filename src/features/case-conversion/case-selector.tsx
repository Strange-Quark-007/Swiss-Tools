import { ConversionType } from '@/types/common';
import { Selector } from '@/components/content-layout/selector';

import { CASES } from './utils';

interface Props {
  type: ConversionType;
}

export const CaseSelector = ({ type }: Props) => {
  return <Selector type={type} options={Object.values(CASES)} />;
};
