export interface Option<ValueType> {
  value: ValueType;
  label: string;
  warning?: string;
  disabled?: boolean;
}
