import { useForm } from 'react-hook-form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUrlSearchParams } from '@/hooks/use-search-params';
import { Text } from '@/components/typography/text';
import { Input } from '@/components/ui/input';
import { ConversionType } from '@/types/common';
import { useT } from '@/i18n/utils';

import { BASES, BaseType, CustomBaseFormValues, getCustomBaseValidationRules, validateCustomBase } from './utils';

interface Props {
  type: ConversionType;
  onCustomBaseChange?: (value: string) => void;
}

export const BaseSelector = ({ type, onCustomBaseChange }: Props) => {
  const t = useT();
  const [base, setBase] = useUrlSearchParams(type);

  const form = useForm<CustomBaseFormValues>({
    defaultValues: {
      customBase: '',
    },
    mode: 'onChange',
  });

  const onValueChange = (value: BaseType) => {
    if (value !== base) {
      if (value === BASES.custom.value) {
        form.reset({ customBase: '' });
      }
      setBase(value);
    }
  };

  const handleCustomBaseChange = (value: string) => {
    if (onCustomBaseChange) {
      const validatedValue = validateCustomBase(value);
      onCustomBaseChange(validatedValue);
    }
  };

  return (
    <FlexContainer direction="col" className="xl:flex-row">
      <div className="flex gap-2 items-center">
        <Text variant="large">{`${type.toUpperCase()}:`}</Text>
        <Select value={base as BaseType} onValueChange={onValueChange}>
          <SelectTrigger className="w-40 hover:cursor-pointer">
            <SelectValue placeholder={`Select ${type}...`} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BASES).map((baseOption) => (
              <SelectItem key={baseOption.value} value={baseOption.value}>
                {baseOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {base === BASES.custom.value && (
        <Form {...form}>
          <FormField
            control={form.control}
            name="customBase"
            rules={getCustomBaseValidationRules(t)}
            render={({ field }) => (
              <FormItem className="flex-1 m-0 relative">
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    type="text"
                    maxLength={2}
                    placeholder={t('numberConversion.customPlaceholder')}
                    onChange={(e) => {
                      if (/^[0-9]*$/.test(e.target.value) && e.target.value.length <= 2) {
                        field.onChange(e);
                        handleCustomBaseChange(e.target.value);
                      }
                    }}
                    onBlur={() => {
                      form.trigger('customBase');
                    }}
                  />
                </FormControl>
                <FormMessage className="absolute text-sm right-0 m-2" />
              </FormItem>
            )}
          />
        </Form>
      )}
    </FlexContainer>
  );
};
