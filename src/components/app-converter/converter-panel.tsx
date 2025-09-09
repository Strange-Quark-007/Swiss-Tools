'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/i18n/utils';
import { ConverterPanelProps } from '@/types/converter-panel';

import { PanelActions } from './panel-actions';

export const ConverterPanel = <SelectorProps extends object>({
  type,
  value,
  error,
  readOnly,
  placeholder,
  SelectorComponent,
  selectorProps,
  onTextChange,
  onSample,
  onCopy,
  onClear,
  onUpload,
  onDownload,
}: ConverterPanelProps<SelectorProps>) => {
  const t = useT();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const actionProps = readOnly ? { readOnly, onCopy, onDownload } : { onSample, onCopy, onClear, onUpload, onDownload };

  return (
    <FlexContainer direction="col" className="h-full min-w-0">
      <div className="flex gap-4 justify-between items-start">
        {SelectorComponent && <SelectorComponent type={type} {...(selectorProps ?? ({} as SelectorProps))} />}
        <PanelActions {...actionProps} />
      </div>
      <Textarea
        className={`flex-1 break-all resize-none text-wrap transition-colors duration-300 ${
          error ? 'border-destructive focus-visible:border-destructive text-red-400' : ''
        }`}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value={value || error || ''}
        onChange={(e) => onTextChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder || t(`converter.resultPlaceholder`)}
      />
    </FlexContainer>
  );
};
