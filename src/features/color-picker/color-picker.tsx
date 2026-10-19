'use client';

import { FlexContainer } from '@/components/content-layout/flex-container';
import { useUnmountEffect } from '@/hooks/use-unmount-effect';

import { ColorPickerInput } from './color-picker-input';
import { ColorPickerOutput } from './color-picker-output';
import { useColorPickerStore } from './color-picker-store';

export const ColorPicker = () => {
  const { reset } = useColorPickerStore();

  useUnmountEffect(reset);

  return (
    <FlexContainer direction="col" className="gap-16 lg:flex-row">
      <ColorPickerInput />
      <ColorPickerOutput />
    </FlexContainer>
  );
};
