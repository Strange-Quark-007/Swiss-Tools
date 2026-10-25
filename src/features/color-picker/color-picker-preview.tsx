import { cn } from 'cn';
import { formatCss } from 'culori';

import { Text } from '@/components/typography/text';
import { useT } from '@/i18n/utils';

import { useColorPickerStore } from './color-picker-store';

interface ColorPickerPreviewProps {
  className?: string;
}

export const ColorPickerPreview = ({ className }: ColorPickerPreviewProps = {}) => {
  const { t } = useT();
  const { color } = useColorPickerStore();

  return (
    <div className={cn('flex flex-col gap-2 shrink-0', className)}>
      <Text variant="large" className="flex items-center h-9">
        {t('label.preview').toUpperCase()}:
      </Text>
      <div
        data-testid="color-picker-preview"
        className="size-48 2xl:w-full rounded-xl overflow-hidden border border-border shadow-sm dark:shadow-secondary transition-shadow hover:shadow-md shrink-0"
        style={{
          backgroundImage: `linear-gradient(${formatCss(color)}, ${formatCss(color)}),
          repeating-conic-gradient(#ccc 0% 25%, #eee 0% 50%)`,
          backgroundSize: '16px 16px',
          backgroundBlendMode: 'normal',
        }}
      />
    </div>
  );
};
