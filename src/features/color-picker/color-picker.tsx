'use client';

import { FlexContainer } from '@/components/content-layout/flex-container';

import { ColorPickerInput } from './color-picker-input';
import { ColorPickerOutput } from './color-picker-output';

export const ColorPicker = () => {
  return (
    <FlexContainer direction="col" className="gap-16 lg:flex-row">
      <ColorPickerInput />
      <ColorPickerOutput />
    </FlexContainer>
  );
};
