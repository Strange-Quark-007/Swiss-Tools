'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Textarea } from '@/components/ui/textarea';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { useT } from '@/i18n/utils';

interface Props<SelectorProps extends object> {
  type: SEARCH_PARAM_KEYS;
  value?: string;
  error?: string;
  placeholder?: string;
  onTextChange: (text: string) => void;
  SelectorComponent?: React.ComponentType<{ type: SEARCH_PARAM_KEYS } & SelectorProps>;
  selectorProps?: SelectorProps;
}

export const ConversionPanel = <SelectorProps extends object>({
  type,
  value,
  error,
  onTextChange,
  placeholder,
  SelectorComponent,
  selectorProps,
}: Props<SelectorProps>) => {
  const t = useT();

  useEffect(() => {
    if (error) toast.error(error);
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
        onChange={(e) => onTextChange(e.target.value)}
        readOnly={type === 'to'}
        placeholder={placeholder || t(`conversion.resultPlaceholder`)}
      />
    </FlexContainer>
  );
};
