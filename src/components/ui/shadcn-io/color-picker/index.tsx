'use client';

import { converter, Hsl } from 'culori';
import { PipetteIcon } from 'lucide-react';
import { Slider } from 'radix-ui';
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/ui/input';
import { hslToUi, hslUiToNormalized } from '@/features/color-picker/utils';
import { cn } from '@/lib/utils';

import { ButtonBase } from '../../button-base';

export const DEFAULT_HSL_COLOR = { mode: 'hsl', h: 0, s: 0, l: 1, alpha: 1 } as const;

const hsl = converter('hsl');

interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(undefined);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);

  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPickerProvider');
  }

  return context;
};

export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onColorChange?: (value: Hsl) => void;
}

export const ColorPickerWidget = ({ value, defaultValue, onColorChange, className, ...props }: ColorPickerProps) => {
  const selectedColorHsl = hsl(value || defaultValue);

  const [hue, setHue] = useState(selectedColorHsl?.h || DEFAULT_HSL_COLOR.h);
  const [saturation, setSaturation] = useState(selectedColorHsl?.s || DEFAULT_HSL_COLOR.s);
  const [lightness, setLightness] = useState(selectedColorHsl?.l || DEFAULT_HSL_COLOR.l * 100);
  const [alpha, setAlpha] = useState(selectedColorHsl?.alpha || DEFAULT_HSL_COLOR.alpha);
  const [mode, setMode] = useState('hex');

  // Update color when controlled value changes
  useEffect(() => {
    if (value) {
      const color = hsl(value);
      const uiValues = hslToUi(color);
      setHue(uiValues?.h || DEFAULT_HSL_COLOR.h);
      setSaturation(uiValues?.s || DEFAULT_HSL_COLOR.s);
      setLightness(uiValues?.l || DEFAULT_HSL_COLOR.l);
      setAlpha(uiValues?.alpha || DEFAULT_HSL_COLOR.alpha);
    }
  }, [value]);

  // Notify parent of changes
  useEffect(() => {
    if (onColorChange) {
      const normalizedColor = hslUiToNormalized({ h: hue, s: saturation, l: lightness, alpha });

      onColorChange(normalizedColor);
    }
  }, [hue, saturation, lightness, alpha, onColorChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
      }}
    >
      <div className={cn('flex size-full flex-col gap-4', className)} {...props} />
    </ColorPickerContext.Provider>
  );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(({ className, ...props }: ColorPickerSelectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

  const backgroundGradient = useMemo(() => {
    return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`;
  }, [hue]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging && containerRef.current)) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      setPositionX(x);
      setPositionY(y);
      setSaturation(x * 100);
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
      const lightness = topLightness * (1 - y);

      setLightness(lightness);
    },
    [isDragging, setSaturation, setLightness]
  );

  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove]);

  useEffect(() => {
    if (!isDragging) {
      // Reverse the drag mapping to compute pointer position
      // Given lightness and saturation, solve for x and y
      let x = saturation / 100;
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
      let y = 1 - lightness / topLightness;

      // Clamp values to [0, 1]
      x = Math.max(0, Math.min(1, x));
      y = Math.max(0, Math.min(1, y));

      setPositionX(x);
      setPositionY(y);
    }
  }, [saturation, lightness, isDragging]);

  return (
    <div
      className={cn('relative size-full cursor-crosshair rounded touch-none', className)}
      onPointerDown={(e) => {
        e.preventDefault();

        setIsDragging(true);
        handlePointerMove(e.nativeEvent);
      }}
      ref={containerRef}
      style={{
        background: backgroundGradient,
      }}
      {...props}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute z-0 h-4 w-4 rounded-full border-2 border-white"
        style={{
          left: `${positionX * 100}%`,
          top: `${positionY * 100}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
});

ColorPickerSelection.displayName = 'ColorPickerSelection';

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerHue = ({ className, ...props }: ColorPickerHueProps) => {
  const { hue, setHue } = useColorPicker();

  return (
    <Slider.Root
      className={cn('relative flex h-4 w-full touch-none', className)}
      max={360}
      onValueChange={([hue]) => setHue(hue)}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
};

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({ className, ...props }: ColorPickerAlphaProps) => {
  const { alpha, setAlpha } = useColorPicker();

  return (
    <Slider.Root
      className={cn('relative flex h-4 w-full touch-none', className)}
      max={100}
      onValueChange={([alpha]) => setAlpha(alpha / 100)}
      step={1}
      value={[alpha * 100]}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow rounded-full dark:invert"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-black/50" />
        <Slider.Range className="absolute h-full rounded-full bg-transparent" />
      </Slider.Track>
      <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof ButtonBase>;

export const ColorPickerEyeDropper = ({ className, ...props }: ColorPickerEyeDropperProps) => {
  const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();

  const handleEyeDropper = async () => {
    try {
      // @ts-expect-error - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = hsl(result.sRGBHex as string);
      const [h, s, l] = [color?.h, color?.s, color?.l];

      setHue(h || DEFAULT_HSL_COLOR.h);
      setSaturation(s || DEFAULT_HSL_COLOR.s);
      setLightness(l || DEFAULT_HSL_COLOR.l);
      setAlpha(1);
    } catch (error) {
      console.error('EyeDropper failed:', error);
    }
  };

  return (
    <ButtonBase
      className={cn('shrink-0 text-muted-foreground', className)}
      onClick={handleEyeDropper}
      size="icon"
      variant="outline"
      type="button"
      {...props}
    >
      <PipetteIcon size={16} />
    </ButtonBase>
  );
};

type PercentageInputProps = ComponentProps<typeof Input>;

export const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        readOnly
        type="text"
        {...props}
        className={cn('h-8 w-[3.25rem] rounded-l-none bg-secondary px-2 text-xs shadow-none', className)}
      />
      <span className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground text-xs">%</span>
    </div>
  );
};
