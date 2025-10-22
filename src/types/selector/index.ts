import { TOOLTIP_TYPE } from '@/constants/common';

export interface Option<ValueType> {
  value: ValueType;
  tooltip?: {
    type: TOOLTIP_TYPE;
    messageKey: string;
  };
  label: string;
  disabled?: boolean;
}
