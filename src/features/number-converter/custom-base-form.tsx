'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useT } from '@/i18n/utils';

import { CustomBaseFormValues, getCustomBaseValidationRules } from './utils';

interface Props {
  customBase: string;
  onCustomBaseChange: (value: string) => void;
}

const CustomBaseForm = ({ customBase, onCustomBaseChange }: Props) => {
  const t = useT();
  const form = useForm<CustomBaseFormValues>({
    defaultValues: { customBase: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    form.setValue('customBase', customBase);
  }, [form, customBase]);

  return (
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
                placeholder={t('numberConverter.customPlaceholder')}
                value={customBase}
                onChange={(e) => {
                  if (/^[0-9]*$/.test(e.target.value) && e.target.value.length <= 2) {
                    field.onChange(e);
                    onCustomBaseChange(e.target.value);
                  }
                }}
                onBlur={() => form.trigger('customBase')}
              />
            </FormControl>
            <FormMessage className="absolute text-sm right-0 m-2" />
          </FormItem>
        )}
      />
    </Form>
  );
};

export default CustomBaseForm;
