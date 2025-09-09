import { Copy, Download, Eraser, FileText, Upload } from 'lucide-react';

import { PanelActionProps } from '@/types/panel-actions';
import { useT } from '@/i18n/utils';

import { ButtonWithTooltip } from '../common/button-with-tooltip';
import { FlexContainer } from '../content-layout/flex-container';

export const PanelActions = ({ readOnly, onSample, onUpload, onCopy, onClear, onDownload }: PanelActionProps) => {
  const t = useT();

  return (
    <FlexContainer direction="row" className="items-center gap-0 ml-auto">
      {!readOnly && onSample && (
        <ButtonWithTooltip variant="ghost" className="group" tooltip={t('label.sampleData')} onClick={onSample}>
          <FileText className="group-active:scale-90 w-4 h-4" />
        </ButtonWithTooltip>
      )}
      {!readOnly && (
        <ButtonWithTooltip variant="ghost" className="group" tooltip={t('label.upload')} onClick={onUpload}>
          <Upload className="group-active:scale-90 w-4 h-4" />
        </ButtonWithTooltip>
      )}
      <ButtonWithTooltip variant="ghost" className="group" tooltip={t('label.copy')} onClick={onCopy}>
        <Copy className="group-active:scale-90 w-4 h-4" />
      </ButtonWithTooltip>
      {!readOnly && (
        <ButtonWithTooltip variant="ghost" className="group" tooltip={t('label.clear')} onClick={onClear}>
          <Eraser className="group-active:scale-90 w-4 h-4" />
        </ButtonWithTooltip>
      )}
      {readOnly && (
        <ButtonWithTooltip variant="ghost" className="group" tooltip={t('label.download')} onClick={onDownload}>
          <Download className="transform group-active:translate-y-0.5 w-4 h-4" />
        </ButtonWithTooltip>
      )}
    </FlexContainer>
  );
};
