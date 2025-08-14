import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Text } from '@/components/typography/text';

import { CASES, CaseType, ConversionType } from './utils';

interface Props {
  type: ConversionType;
}

export const CaseSelector = ({ type }: Props) => {
  const [caseType, setCaseType] = useUrlSearchParams(type);

  const onValueChange = (value: CaseType) => {
    if (value !== caseType) {
      setCaseType(value);
    }
  };

  return (
    <FlexContainer direction="col" className="xl:flex-row">
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={caseType as CaseType} onValueChange={onValueChange}>
          <SelectTrigger className="w-40 hover:cursor-pointer">
            <SelectValue placeholder={`Select ${type}...`} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CASES).map((caseOption) => (
              <SelectItem key={caseOption.value} value={caseOption.value}>
                {caseOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FlexContainer>
  );
};
