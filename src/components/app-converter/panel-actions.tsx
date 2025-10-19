import { Check, Copy, Download, Eraser, FileText, Upload } from 'lucide-react';
import { useState } from 'react';

import { GA_EVENTS } from '@/constants/gaEvents';
import { useT } from '@/i18n/utils';
import { PanelActionProps } from '@/types/panel-actions';

import { ButtonWithTooltip } from '../common/button-with-tooltip';
import { FlexContainer } from '../content-layout/flex-container';

export const PanelActions = ({
  readOnly,
  copyContext,
  onSample,
  onUpload,
  onCopy,
  onClear,
  onDownload,
}: PanelActionProps) => {
  const { t } = useT();
  const [copied, setCopied] = useState(false);

  const context = copyContext ?? (readOnly ? t('label.result') : t('label.input'));

  const CopyComponent = copied ? Check : Copy;

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <FlexContainer
      direction="row"
      id={`panel-actions-${context}`}
      className="items-center min-w-20 md:min-w-max justify-end gap-0 gap-y-4 ml-auto flex-wrap md:flex-nowrap lg:flex-wrap xl:flex-nowrap"
    >
      {!readOnly && onSample && (
        <ButtonWithTooltip
          eventName={GA_EVENTS.SAMPLE}
          variant="ghost"
          className="group"
          tooltip={t('label.sampleData')}
          ariaLabel={t('label.sampleData')}
          onClick={onSample}
        >
          <FileText className="group-active:scale-90" />
        </ButtonWithTooltip>
      )}
      {!readOnly && onUpload && (
        <ButtonWithTooltip
          eventName={GA_EVENTS.UPLOAD}
          variant="ghost"
          className="group"
          tooltip={t('label.upload')}
          ariaLabel={t('label.upload')}
          onClick={onUpload}
        >
          <Upload className="transform group-active:-translate-y-0.5" />
        </ButtonWithTooltip>
      )}
      {onCopy && (
        <ButtonWithTooltip
          eventName={readOnly ? GA_EVENTS.COPY_RESULT : GA_EVENTS.COPY_INPUT}
          eventParams={{ context }}
          variant="ghost"
          className="group"
          tooltip={t('label.copy')}
          ariaLabel={t('aria.copyContext', { context })}
          onClick={handleCopy}
        >
          <CopyComponent className="group-active:scale-90" />
        </ButtonWithTooltip>
      )}
      {!readOnly && onClear && (
        <ButtonWithTooltip
          eventName={GA_EVENTS.CLEAR}
          variant="ghost"
          className="group"
          tooltip={t('label.clear')}
          ariaLabel={t('label.clear')}
          onClick={onClear}
        >
          <Eraser className="text-destructive custom-transition-color group-active:animate-shake-x" />
        </ButtonWithTooltip>
      )}
      {readOnly && onDownload && (
        <ButtonWithTooltip
          eventName={GA_EVENTS.DOWNLOAD}
          variant="ghost"
          className="group"
          tooltip={t('label.download')}
          ariaLabel={t('label.download')}
          onClick={onDownload}
        >
          <Download className="group-active:translate-y-0.5" />
        </ButtonWithTooltip>
      )}
    </FlexContainer>
  );
};
