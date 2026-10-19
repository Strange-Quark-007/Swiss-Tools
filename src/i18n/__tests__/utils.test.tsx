import { renderHook } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LOCALE } from '@/constants/common';

import { getT, useT } from '../utils';

vi.unmock('@/i18n/utils');

const mockBaseT = Object.assign(vi.fn(), {
  rich: vi.fn(),
});

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
    mockBaseT.rich.mockImplementation((key: string, values?: Record<string, unknown>) => {
      return React.createElement('div', { 'data-key': key }, String(values?.appName ?? ''));
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

      expect(mockBaseT.rich).toHaveBeenCalledWith(
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

      const passedComponents = mockBaseT.rich.mock.calls[0][1];

      expect(passedComponents.span('span')).toEqual(<span>span</span>);
      expect(passedComponents.p('para')).toEqual(<p>para</p>);
      expect(passedComponents.b('bold')).toEqual(<b>bold</b>);
      expect(passedComponents.strong('strong')).toEqual(<strong>strong</strong>);
      expect(passedComponents.i('italic')).toEqual(<i>italic</i>);
      expect(passedComponents.em('emphasis')).toEqual(<em>emphasis</em>);
      expect(passedComponents.code('code')).toEqual(<code>code</code>);
      expect(passedComponents.br()).toEqual(<br />);
      expect(passedComponents.ul('list')).toEqual(<ul>list</ul>);
      expect(passedComponents.ol('ordered')).toEqual(<ol>ordered</ol>);
      expect(passedComponents.li('item')).toEqual(<li>item</li>);
    });

    it('should apply custom classNames to default components when provided', () => {
      const { result } = renderHook(() => useT());

      result.current.richT('test', {
        classNames: {
          span: 'custom-span',
          p: 'custom-p',
          b: 'custom-b',
          strong: 'custom-strong',
          i: 'custom-i',
          em: 'custom-em',
          code: 'custom-code',
          br: 'custom-br',
          ul: 'custom-ul',
          ol: 'custom-ol',
          li: 'custom-li',
        },
      });

      const passedComponents = mockBaseT.rich.mock.calls[0][1];

      expect(passedComponents.span('span')).toEqual(<span className="custom-span">span</span>);
      expect(passedComponents.p('para')).toEqual(<p className="custom-p">para</p>);
      expect(passedComponents.b('bold')).toEqual(<b className="custom-b">bold</b>);
      expect(passedComponents.strong('strong')).toEqual(<strong className="custom-strong">strong</strong>);
      expect(passedComponents.i('italic')).toEqual(<i className="custom-i">italic</i>);
      expect(passedComponents.em('emphasis')).toEqual(<em className="custom-em">emphasis</em>);
      expect(passedComponents.code('code')).toEqual(<code className="custom-code">code</code>);
      expect(passedComponents.br()).toEqual(<br className="custom-br" />);
      expect(passedComponents.ul('list')).toEqual(<ul className="custom-ul">list</ul>);
      expect(passedComponents.ol('ordered')).toEqual(<ol className="custom-ol">ordered</ol>);
      expect(passedComponents.li('item')).toEqual(<li className="custom-li">item</li>);
    });
  });

  describe('getT async server helper', () => {
    it('should load translations with default locale and provide plain and rich functions', async () => {
      const { getTranslations } = await import('next-intl/server');

      const translations = await getT();

      expect(getTranslations).toHaveBeenCalledWith({ locale: LOCALE });

      const plain = translations.t('server.key');
      expect(plain).toBe('server.key:Swiss Tools');

      translations.richT('server.rich', {
        classNames: {
          ul: 'server-ul',
        },
      });
      translations.richT('server.default');
      expect(mockBaseT.rich).toHaveBeenCalledWith(
        'server.default',
        expect.objectContaining({
          appName: 'Swiss Tools',
        })
      );
    });
  });
});
