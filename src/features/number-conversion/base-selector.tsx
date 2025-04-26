import { useForm } from 'react-hook-form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Text } from '@/components/typography/text';
import { Input } from '@/components/ui/input';
import { useT } from '@/i18n/utils';

import {
  BASES,
  BaseType,
  ConversionType,
  CustomBaseFormValues,
  getCustomBaseValidationRules,
  validateCustomBase,
} from './utils';

interface Props {
  type: ConversionType;
  base: BaseType;
  onChange: (value: BaseType) => void;
  onCustomBaseChange?: (value: string) => void;
}

function BaseSelector({ type, base, onChange, onCustomBaseChange }: Props) {
  const t = useT();
  const form = useForm<CustomBaseFormValues>({
    defaultValues: {
      customBase: '',
    },
    mode: 'onChange',
  });

  const onValueChange = (value: BaseType) => {
    if (value !== base) {
      if (value === 'custom') {
        form.reset({ customBase: '' });
      }
      onChange(value);
    }
  };

  const handleCustomBaseChange = (value: string) => {
    if (onCustomBaseChange) {
      const validatedValue = validateCustomBase(value);
      onCustomBaseChange(validatedValue);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Text variant="large">{`${type.toUpperCase()}:`}</Text>
      <Select value={base} onValueChange={onValueChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={`Select ${type}...`} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(BASES).map((base) => (
            <SelectItem key={base.value} value={base.value}>
              {base.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {base === 'custom' && (
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
    </div>
  );
}

export default BaseSelector;
