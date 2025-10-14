/* --------- Base Props --------- */
interface BasePanelActionProps {
  readOnly?: boolean;
  copyContext?: string;
}

/* --------- Editable Actions Panel --------- */
export interface EditablePanelActions extends BasePanelActionProps {
  readOnly?: false;
  onSample?: () => void;
  onUpload?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onDownload?: () => void;
}

/* --------- ReadOnly Actions Panel --------- */
export interface ReadOnlyPanelActions extends BasePanelActionProps {
  readOnly: true;
  onSample?: never;
  onUpload?: never;
  onClear?: never;
  onCopy?: () => void;
  onDownload?: () => void;
}

/* --------- Final Discriminated Union --------- */
export type PanelActionProps = EditablePanelActions | ReadOnlyPanelActions;
