import baseX from 'base-x'; // base58, base62, base128
import base32 from 'hi-base32';
import ascii85 from 'ascii85';
import base91 from 'node-base91';
import { Buffer } from 'buffer';

import { TranslationFunction } from '@/i18n/utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult } from '@/types/common';

export type CodecType = (typeof CODECS)[keyof typeof CODECS]['value'];
export type ModeType = (typeof MODES)[keyof typeof MODES]['value'];

export const MODES = {
  encode: { value: 'encode', label: 'Encode', inverse: 'decode' },
  decode: { value: 'decode', label: 'Decode', inverse: 'encode' },
} as const;

export const CODECS = {
  base2: { value: 'base2', label: 'Binary (Base2)' },
  base8: { value: 'base8', label: 'Octal (Base8)' },
  base16: { value: 'base16', label: 'Hex (Base16)' },
  base32: { value: 'base32', label: 'Base32' },
  base58: { value: 'base58', label: 'Base58' },
  base62: { value: 'base62', label: 'Base62' },
  base64: { value: 'base64', label: 'Base64' },
  ascii85: { value: 'ascii85', label: 'ASCII85' },
  base91: { value: 'base91', label: 'Base91' },
  base128: { value: 'base128', label: 'Base128', warning: 'encoderDecoder.base128Warning' },
  url: { value: 'url', label: 'URL' },
  html: { value: 'html', label: 'HTML Entities' },
} as const;

const ALPHABETS = {
  base58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  base62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  base128: Array.from({ length: 128 }, (_, i) => String.fromCharCode(i)).join(''),
} as const;

export const Transcode = (text: string, codec: CodecType, mode: ModeType, t: TranslationFunction): ConverterResult => {
  if (!text) {
    return { result: '' };
  }

  try {
    let result = '';

    switch (codec) {
      case CODECS.base2.value:
        if (mode === MODES.encode.value) {
          result = Array.from(Buffer.from(text, 'utf-8'))
            .map((b) => b.toString(2).padStart(8, '0'))
            .join(' ');
        } else {
          result = text
            .trim()
            .split(/\s+/)
            .map((b) => String.fromCharCode(parseInt(b, 2)))
            .join('');
        }
        break;

      case CODECS.base8.value:
        if (mode === MODES.encode.value) {
          result = Array.from(Buffer.from(text, 'utf-8'))
            .map((b) => b.toString(8))
            .join(' ');
        } else {
          result = text
            .trim()
            .split(/\s+/)
            .map((o) => String.fromCharCode(parseInt(o, 8)))
            .join('');
        }
        break;

      case CODECS.base16.value:
        if (mode === MODES.encode.value) {
          result = Buffer.from(text, 'utf-8').toString('hex');
        } else {
          result = Buffer.from(text, 'hex').toString('utf-8');
        }
        break;

      case CODECS.base32.value:
        if (mode === MODES.encode.value) {
          result = base32.encode(text);
        } else {
          result = Buffer.from(base32.decode.asBytes(text)).toString('utf-8');
        }
        break;

      case CODECS.base58.value: {
        const cx = baseX(ALPHABETS.base58);
        if (mode === MODES.encode.value) {
          result = cx.encode(Buffer.from(text, 'utf-8'));
        } else {
          result = Buffer.from(cx.decode(text)).toString('utf-8');
        }
        break;
      }

      case CODECS.base62.value: {
        const cx = baseX(ALPHABETS.base62);
        if (mode === MODES.encode.value) {
          result = cx.encode(Buffer.from(text, 'utf-8'));
        } else {
          result = Buffer.from(cx.decode(text)).toString('utf-8');
        }
        break;
      }

      case CODECS.base64.value:
        if (mode === MODES.encode.value) {
          result = Buffer.from(text, 'utf-8').toString('base64');
        } else {
          result = Buffer.from(text, 'base64').toString('utf-8');
        }
        break;

      case CODECS.ascii85.value:
        try {
          if (mode === MODES.encode.value) {
            result = ascii85.encode(text).toString();
          } else {
            const decoded = ascii85.decode(text);
            result = Buffer.from(decoded).toString('utf-8');
          }
        } catch (_err) {
          return { result: '', error: t('encoderDecoder.genericError') };
        }
        break;

      case CODECS.base91.value:
        if (mode === MODES.encode.value) {
          result = base91.encode(Buffer.from(text, 'utf-8'));
        } else {
          result = Buffer.from(base91.decode(text)).toString('utf-8');
        }
        break;

      case CODECS.base128.value: {
        const cx = baseX(ALPHABETS.base128);
        if (mode === MODES.encode.value) {
          result = cx.encode(Buffer.from(text, 'utf-8'));
        } else {
          result = Buffer.from(cx.decode(text)).toString('utf-8');
        }
        break;
      }

      case CODECS.url.value:
        result = mode === MODES.encode.value ? encodeURIComponent(text) : decodeURIComponent(text);
        break;

      case CODECS.html.value:
        if (mode === MODES.encode.value) {
          result = text
            .split('')
            .map((c) => `&#${c.charCodeAt(0)};`)
            .join('');
        } else {
          result = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
        }
        break;

      default:
        exhaustiveCheck(codec);
    }

    return { result };
  } catch (_err) {
    return { result: '', error: t('encoderDecoder.genericError') };
  }
};
