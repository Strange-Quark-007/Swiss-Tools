import { useEffect } from 'react';
import { toast } from 'sonner';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/i18n/utils';

import { BaseSelector } from './base-selector';
import { ConversionType } from './utils';

interface Props {
  type: ConversionType;
  value?: string;
  error?: string;
  onTextChange: (text: string) => void;
  onCustomBaseChange?: (value: string) => void;
  placeholder?: string;
}

export const ConversionPanel = ({ type, value, error, onTextChange, onCustomBaseChange, placeholder }: Props) => {
  const t = useT();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <FlexContainer direction="col" className="h-full">
      <BaseSelector type={type} onCustomBaseChange={onCustomBaseChange} />
      <Textarea
        className={`flex-grow resize-none text-wrap transition-colors duration-300 ${
          error ? 'border-destructive focus-visible:border-destructive' : ''
        }`}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value={value || ''}
        onChange={(e) => onTextChange(e.target.value)}
        readOnly={type === 'to'}
        placeholder={placeholder || t(`numberConversion.${type}Placeholder`)}
      />
    </FlexContainer>
  );
};
