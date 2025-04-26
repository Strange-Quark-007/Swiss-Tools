import { Textarea } from '@/components/ui/textarea';

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
  const isReadOnly = type === 'to';

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
        readOnly={isReadOnly}
        placeholder={isReadOnly ? 'Conversion result will appear here' : 'Enter a number to convert'}
      />
    </div>
  );
}

export default ConversionPanel;
