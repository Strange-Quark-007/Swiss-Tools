import { useEffect } from 'react';
import { toast } from 'sonner';

import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/i18n/utils';

import BaseSelector from './base-selector';
import { BaseType, ConversionType } from './utils';

interface Props {
  type: ConversionType;
  base: BaseType;
  value?: string;
  error?: string;
  onSelectChange: (value: BaseType) => void;
  onTextChange: (text: string) => void;
  onCustomBaseChange?: (value: string) => void;
  placeholder?: string;
}

function ConversionPanel({
  type,
  base,
  value,
  error,
  onSelectChange,
  onTextChange,
  onCustomBaseChange,
  placeholder,
}: Props) {
  const t = useT();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-4 h-4/6">
      <BaseSelector type={type} base={base} onChange={onSelectChange} onCustomBaseChange={onCustomBaseChange} />
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
    </div>
  );
}

export default ConversionPanel;
