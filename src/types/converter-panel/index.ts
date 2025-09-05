import { SEARCH_PARAM_KEYS } from '@/constants/common';

/* --------- Base Props --------- */
interface BaseProps {
  value?: string;
  error?: string;
  placeholder?: string;
}

/* --------- Selector Variants --------- */
interface WithSelector<SelectorProps extends object> {
  type: SEARCH_PARAM_KEYS;
  SelectorComponent: React.ComponentType<{ type: SEARCH_PARAM_KEYS } & SelectorProps>;
  selectorProps?: SelectorProps;
}

interface WithoutSelector {
  type?: never;
  SelectorComponent?: never;
  selectorProps?: never;
}

/* --------- Editable Panel --------- */
interface EditableWithSelector<SelectorProps extends object> extends BaseProps, WithSelector<SelectorProps> {
  readOnly?: false;
  onTextChange: (text: string) => void;
}

interface EditableWithoutSelector extends BaseProps, WithoutSelector {
  readOnly?: false;
  onTextChange: (text: string) => void;
}

type EditablePanelProps<SelectorProps extends object> = EditableWithSelector<SelectorProps> | EditableWithoutSelector;

/* --------- ReadOnly Panel --------- */
interface ReadOnlyWithSelector<SelectorProps extends object> extends BaseProps, WithSelector<SelectorProps> {
  readOnly: true;
  onTextChange?: never;
}

interface ReadOnlyWithoutSelector extends BaseProps, WithoutSelector {
  readOnly: true;
  onTextChange?: never;
}

type ReadOnlyPanelProps<SelectorProps extends object> = ReadOnlyWithSelector<SelectorProps> | ReadOnlyWithoutSelector;

/* --------- Final Discriminated Union --------- */
export type ConverterPanelProps<SelectorProps extends object> =
  | EditablePanelProps<SelectorProps>
  | ReadOnlyPanelProps<SelectorProps>;
