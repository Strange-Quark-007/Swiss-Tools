import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Text } from '@/components/typography/text';
import { ConversionType } from '@/types/common';

import { DATA_FORMATS, DataFormatType } from './utils';

interface Props {
  type: ConversionType;
}

export const DataFormatSelector = ({ type }: Props) => {
  const [format, setFormat] = useUrlSearchParams<DataFormatType>(type);

  const onValueChange = (value: DataFormatType) => {
    if (value !== format) {
      setFormat(value);
    }
  };

  return (
    <FlexContainer direction="col" className="xl:flex-row">
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={format} onValueChange={onValueChange}>
          <SelectTrigger className="w-40 hover:cursor-pointer">
            <SelectValue placeholder={`Select ${type}...`} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DATA_FORMATS).map((formatOption) => (
              <SelectItem key={formatOption.value} value={formatOption.value}>
                {formatOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FlexContainer>
  );
};
