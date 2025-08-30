'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/i18n/utils';
import { ConversionPanelProps } from '@/types/conversion-panel';

export const ConversionPanel = <SelectorProps extends object>({
  type,
  value,
  error,
  placeholder,
  readOnly,
  onTextChange,
  SelectorComponent,
  selectorProps,
}: ConversionPanelProps<SelectorProps>) => {
  const t = useT();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <FlexContainer direction="col" className="h-full">
      {SelectorComponent ? (
        <SelectorComponent type={type} {...(selectorProps ?? ({} as SelectorProps))} />
      ) : (
        <div className="h-9" />
      )}
      <Textarea
        className={`flex-grow resize-none text-wrap transition-colors duration-300 ${
          error ? 'border-destructive focus-visible:border-destructive text-red-400' : ''
        }`}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value={value || error || ''}
        onChange={(e) => onTextChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder || t(`conversion.resultPlaceholder`)}
      />
    </FlexContainer>
  );
};
