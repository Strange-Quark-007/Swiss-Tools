import { Copy, Download, Eraser, FileText, Upload } from 'lucide-react';

import { PanelActionProps } from '@/types/panel-actions';
import { useT } from '@/i18n/utils';

import { ButtonWithTooltip } from '../common/button-with-tooltip';
import { FlexContainer } from '../content-layout/flex-container';

export const PanelActions = ({ readOnly, onSample, onUpload, onCopy, onClear, onDownload }: PanelActionProps) => {
  const t = useT();
  const context = readOnly ? 'Result' : 'Input';

  return (
    <FlexContainer direction="row" className="items-center gap-0 ml-auto flex-wrap xs:flex-nowrap h-fit">
      {!readOnly && onSample && (
        <ButtonWithTooltip
          variant="ghost"
          className="group"
          tooltip={t('label.sampleData')}
          ariaLabel={t('label.sampleData')}
          onClick={onSample}
        >
          <FileText className="transition-all duration-100 group-active:scale-90" />
        </ButtonWithTooltip>
      )}
      {!readOnly && (
        <ButtonWithTooltip
          variant="ghost"
          className="group"
          tooltip={t('label.upload')}
          ariaLabel={t('label.upload')}
          onClick={onUpload}
        >
          <Upload className="transition-all duration-100 transform group-active:-translate-y-0.5" />
        </ButtonWithTooltip>
      )}
      <ButtonWithTooltip
        variant="ghost"
        className="group"
        tooltip={t('label.copy')}
        ariaLabel={t(`aria.copy${context}`)}
        onClick={onCopy}
      >
        <Copy className="transition-all duration-100 group-active:scale-90" />
      </ButtonWithTooltip>
      {!readOnly && (
        <ButtonWithTooltip
          variant="ghost"
          className="group"
          tooltip={t('label.clear')}
          ariaLabel={t('label.clear')}
          onClick={onClear}
        >
          <Eraser className="transition-all duration-100 group-active:animate-shake-x text-destructive" />
        </ButtonWithTooltip>
      )}
      {readOnly && (
        <ButtonWithTooltip
          variant="ghost"
          className="group"
          tooltip={t('label.download')}
          ariaLabel={t('label.download')}
          onClick={onDownload}
        >
          <Download className="transition-all duration-100 group-active:translate-y-0.5" />
        </ButtonWithTooltip>
      )}
    </FlexContainer>
  );
};
