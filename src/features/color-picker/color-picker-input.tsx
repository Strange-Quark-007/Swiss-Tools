import { formatCss } from 'culori';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { Text } from '@/components/typography/text';
import {
  ColorPickerAlpha,
  ColorPickerHue,
  ColorPickerSelection,
  ColorPickerWidget,
} from '@/components/ui/shadcn-io/color-picker';
import { useT } from '@/i18n/utils';

import { useColorPickerStore } from './color-picker-store';

export const ColorPickerInput = () => {
  const { t } = useT();
  const { color, setColor } = useColorPickerStore();

  return (
    <FlexContainer id="color-picker-input" direction="row" className="flex-wrap gap-16">
      <div className="flex flex-col gap-2 size-72 lg:size-96">
        <Text variant="large">{t('label.color').toUpperCase()}:</Text>
        <ColorPickerWidget className=" rounded-md border bg-secondary/50 p-4 shadow-sm" onColorChange={setColor}>
          <ColorPickerSelection />
          <div className="flex items-center gap-4">
            <div className="grid w-full gap-1">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
        </ColorPickerWidget>
      </div>
      <div className="flex flex-col gap-2">
        <Text variant="large">{t('label.preview').toUpperCase()}:</Text>
        <div
          className="size-48 rounded-md overflow-hidden border shadow-md"
          style={{
            backgroundImage: `linear-gradient(${formatCss(color)}, ${formatCss(color)}),
          repeating-conic-gradient(#ccc 0% 25%, #eee 0% 50%)`,
            backgroundSize: '16px 16px',
            backgroundBlendMode: 'normal',
          }}
        />
      </div>
    </FlexContainer>
  );
};
