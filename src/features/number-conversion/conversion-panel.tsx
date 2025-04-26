import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/i18n/utils';

import BaseSelector from './base-selector';
import { BaseType, ConversionType } from './utils';

interface Props {
  type: ConversionType;
  base: BaseType;
  value?: string;
  onSelectChange: (value: BaseType) => void;
  onTextChange: (text: string) => void;
  onCustomBaseChange?: (value: string) => void;
}

function ConversionPanel({ type, base, value, onSelectChange, onTextChange, onCustomBaseChange }: Props) {
  const t = useT();

  return (
    <div className="flex flex-col gap-4 h-4/6">
      <BaseSelector type={type} base={base} onChange={onSelectChange} onCustomBaseChange={onCustomBaseChange} />
      <Textarea
        className="flex-grow resize-none text-wrap"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value={value || ''}
        onChange={(e) => onTextChange(e.target.value)}
        readOnly={type === 'to'}
        placeholder={t(`numberConversion.${type}Placeholder`)}
      />
    </div>
  );
}

export default ConversionPanel;
