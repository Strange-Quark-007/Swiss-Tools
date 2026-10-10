import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LOCALE } from '@/constants/common';

import { getT, useT } from '../utils';

const mockBaseT = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(mockBaseT as any).rich = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => mockBaseT,
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => mockBaseT),
}));

describe('i18n utils (useT and getT)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBaseT.mockImplementation((key: string, values?: Record<string, unknown>) => {
      if (key === 'app.name') return 'Swiss Tools';
      return `${key}:${values?.appName ?? ''}`;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockBaseT as any).rich.mockImplementation((key: string, values?: Record<string, unknown>) => {
      return React.createElement('div', { 'data-key': key }, values?.appName as string);
    });
  });

  describe('useT hook', () => {
    it('should return plain translation function with default appName interpolation', () => {
      const { result } = renderHook(() => useT());

      const output = result.current.t('welcome.message', { user: 'Alice' });

      expect(mockBaseT).toHaveBeenCalledWith('welcome.message', {
        appName: 'Swiss Tools',
        user: 'Alice',
      });
      expect(output).toBe('welcome.message:Swiss Tools');
    });

    it('should return rich translation function with default rich components and appName', () => {
      const { result } = renderHook(() => useT());

      result.current.richT('welcome.rich', { extra: 'value' });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((mockBaseT as any).rich).toHaveBeenCalledWith(
        'welcome.rich',
        expect.objectContaining({
          appName: 'Swiss Tools',
          extra: 'value',
          p: expect.any(Function),
          b: expect.any(Function),
          em: expect.any(Function),
          i: expect.any(Function),
          strong: expect.any(Function),
          br: expect.any(Function),
          ul: expect.any(Function),
          li: expect.any(Function),
        })
      );
    });

    it('should properly render default rich components (p, b, em, i, strong, br, ul, li)', () => {
      const { result } = renderHook(() => useT());

      result.current.richT('test');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const passedComponents = (mockBaseT as any).rich.mock.calls[0][1];

      expect(passedComponents.p('para')).toEqual(<p>para</p>);
      expect(passedComponents.b('bold')).toEqual(<b>bold</b>);
      expect(passedComponents.em('emphasis')).toEqual(<em>emphasis</em>);
      expect(passedComponents.i('italic')).toEqual(<i>italic</i>);
      expect(passedComponents.strong('strong')).toEqual(<strong>strong</strong>);
      expect(passedComponents.br()).toEqual(<br />);
      expect(passedComponents.ul('list')).toEqual(<ul className="list-disc list-inside p-2">list</ul>);
      expect(passedComponents.li('item')).toEqual(<li className="mb-1.5">item</li>);
    });
  });

  describe('getT async server helper', () => {
    it('should load translations with default locale and provide plain and rich functions', async () => {
      const { getTranslations } = await import('next-intl/server');

      const translations = await getT();

      expect(getTranslations).toHaveBeenCalledWith({ locale: LOCALE });

      const plain = translations.t('server.key');
      expect(plain).toBe('server.key:Swiss Tools');

      translations.richT('server.rich');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((mockBaseT as any).rich).toHaveBeenCalledWith(
        'server.rich',
        expect.objectContaining({
          appName: 'Swiss Tools',
        })
      );
    });
  });
});
