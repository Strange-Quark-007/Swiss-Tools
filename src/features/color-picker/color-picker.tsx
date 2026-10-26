'use client';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';

import { ColorPickerInput } from './color-picker-input';
import { ColorPickerOutput } from './color-picker-output';
import { ColorPickerPreview } from './color-picker-preview';
import { useColorPickerStore } from './color-picker-store';
import { ColorPickerSwatches } from './color-picker-swatches';

export const ColorPicker = () => {
  const { reset } = useColorPickerStore();

  useUnmountEffect(reset);

  return (
    <FlexContainer direction="row" className="flex-wrap gap-8 items-start">
      <div className="flex flex-wrap sm:flex-nowrap gap-8 items-start">
        <ColorPickerInput />
        <ColorPickerPreview className="flex 2xl:hidden" />
      </div>
      <div className="flex flex-col gap-2 min-w-0 max-w-3xs w-full shrink-0">
        <ColorPickerPreview className="hidden 2xl:flex" />
        <ColorPickerOutput />
      </div>
      <ColorPickerSwatches />
    </FlexContainer>
  );
};
