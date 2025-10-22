export interface Option<ValueType> {
  value: ValueType;
  label: string;
  info?: string;
  warning?: string;
  disabled?: boolean;
}
