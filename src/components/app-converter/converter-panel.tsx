'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { ConverterPanelProps } from '@/types/converter-panel';

import { PanelActions } from './panel-actions';
import { BaseTextarea } from '../common/base-textarea';

export const ConverterPanel = <SelectorProps extends object>({
  type,
  value,
  error,
  readOnly,
  className,
  textareaClassName,
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
  const { t } = useT();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const actionProps = readOnly ? { readOnly, onCopy, onDownload } : { onSample, onCopy, onClear, onUpload, onDownload };

  return (
    <FlexContainer
      id="converter-panel"
      direction="col"
      className={cn('h-full justify-between lg:justify-start min-w-0', className)}
    >
      <div className="flex gap-4 justify-between items-start">
        {SelectorComponent && <SelectorComponent type={type} {...(selectorProps ?? ({} as SelectorProps))} />}
        <PanelActions {...actionProps} />
      </div>
      <BaseTextarea
        className={cn('h-full max-h-[32vh] lg:max-h-[79.5vh]', textareaClassName)}
        error={!!error}
        value={value || error || ''}
        onChange={(e) => onTextChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder || t(`converter.resultPlaceholder`)}
      />
    </FlexContainer>
  );
};
