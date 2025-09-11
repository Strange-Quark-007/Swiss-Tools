import CryptoJS from 'crypto-js';

import { TranslationFunction } from '@/i18n/utils';
import { exhaustiveCheck } from '@/lib/utils';
import { ConverterResult } from '@/types/common';

export type AlgoType = (typeof HASHING_ALGOS)[keyof typeof HASHING_ALGOS]['value'];
export type EncodingType = (typeof HASH_ENCODINGS)[keyof typeof HASH_ENCODINGS]['value'];

export const HASHING_ALGOS = {
  md5: { value: 'md5', label: 'MD5' },
  sha1: { value: 'sha1', label: 'SHA-1' },
  sha224: { value: 'sha224', label: 'SHA-224' },
  sha256: { value: 'sha256', label: 'SHA-256' },
  sha384: { value: 'sha384', label: 'SHA-384' },
  sha512: { value: 'sha512', label: 'SHA-512' },
  sha3_224: { value: 'sha3_224', label: 'SHA3-224' },
  sha3_256: { value: 'sha3_256', label: 'SHA3-256' },
  sha3_384: { value: 'sha3_384', label: 'SHA3-384' },
  sha3_512: { value: 'sha3_512', label: 'SHA3-512' },
} as const;

export const HASH_ENCODINGS = {
  hex: { value: 'hex', label: 'Hex' },
  base64: { value: 'base64', label: 'Base64' },
  base64url: { value: 'base64url', label: 'Base64 URL-safe' },
} as const;

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Format CryptoJS WordArray to selected encoding
 */
function formatWordArray(wordArray: CryptoJS.lib.WordArray, encoding: EncodingType): string {
  switch (encoding) {
    case HASH_ENCODINGS.hex.value:
      return CryptoJS.enc.Hex.stringify(wordArray);
    case HASH_ENCODINGS.base64.value:
      return CryptoJS.enc.Base64.stringify(wordArray);
    case HASH_ENCODINGS.base64url.value:
      return toBase64Url(CryptoJS.enc.Base64.stringify(wordArray));
    default:
      exhaustiveCheck(encoding);
  }
  return '';
}

/**
 * Main hasher
 */
export async function generateHash(
  input: string | File,
  algo: AlgoType,
  encoding: EncodingType,
  t: TranslationFunction
): Promise<ConverterResult> {
  if (!input) {
    return { result: '' };
  }

  try {
    let wordArray: CryptoJS.lib.WordArray | null = null;
    let result = '';

    switch (algo) {
      case HASHING_ALGOS.md5.value:
        wordArray =
          typeof input === 'string'
            ? CryptoJS.MD5(input)
            : CryptoJS.MD5(arrayBufferToWordArray(await input.arrayBuffer()));
        break;

      case HASHING_ALGOS.sha1.value:
        if (typeof crypto !== 'undefined' && crypto.subtle) {
          return { result: await hashWithWebCrypto(input, 'SHA-1', encoding) };
        } else {
          wordArray =
            typeof input === 'string'
              ? CryptoJS.SHA1(input)
              : CryptoJS.SHA1(arrayBufferToWordArray(await input.arrayBuffer()));
        }
        break;

      case HASHING_ALGOS.sha224.value:
        wordArray =
          typeof input === 'string'
            ? CryptoJS.SHA224(input)
            : CryptoJS.SHA224(arrayBufferToWordArray(await input.arrayBuffer()));
        break;

      case HASHING_ALGOS.sha256.value:
        if (typeof crypto !== 'undefined' && crypto.subtle) {
          return { result: await hashWithWebCrypto(input, 'SHA-256', encoding) };
        } else {
          wordArray =
            typeof input === 'string'
              ? CryptoJS.SHA256(input)
              : CryptoJS.SHA256(arrayBufferToWordArray(await input.arrayBuffer()));
        }
        break;

      case HASHING_ALGOS.sha384.value:
        if (typeof crypto !== 'undefined' && crypto.subtle) {
          return { result: await hashWithWebCrypto(input, 'SHA-384', encoding) };
        } else {
          wordArray =
            typeof input === 'string'
              ? CryptoJS.SHA384(input)
              : CryptoJS.SHA384(arrayBufferToWordArray(await input.arrayBuffer()));
        }
        break;

      case HASHING_ALGOS.sha512.value:
        if (typeof crypto !== 'undefined' && crypto.subtle) {
          return { result: await hashWithWebCrypto(input, 'SHA-512', encoding) };
        } else {
          wordArray =
            typeof input === 'string'
              ? CryptoJS.SHA512(input)
              : CryptoJS.SHA512(arrayBufferToWordArray(await input.arrayBuffer()));
        }
        break;

      case HASHING_ALGOS.sha3_224.value:
        wordArray =
          typeof input === 'string'
            ? CryptoJS.SHA3(input, { outputLength: 224 })
            : CryptoJS.SHA3(arrayBufferToWordArray(await input.arrayBuffer()), { outputLength: 224 });
        break;

      case HASHING_ALGOS.sha3_256.value:
        wordArray =
          typeof input === 'string'
            ? CryptoJS.SHA3(input, { outputLength: 256 })
            : CryptoJS.SHA3(arrayBufferToWordArray(await input.arrayBuffer()), { outputLength: 256 });
        break;

      case HASHING_ALGOS.sha3_384.value:
        wordArray =
          typeof input === 'string'
            ? CryptoJS.SHA3(input, { outputLength: 384 })
            : CryptoJS.SHA3(arrayBufferToWordArray(await input.arrayBuffer()), { outputLength: 384 });
        break;

      case HASHING_ALGOS.sha3_512.value:
        wordArray =
          typeof input === 'string'
            ? CryptoJS.SHA3(input, { outputLength: 512 })
            : CryptoJS.SHA3(arrayBufferToWordArray(await input.arrayBuffer()), { outputLength: 512 });
        break;

      default:
        exhaustiveCheck(algo);
    }

    if (wordArray) {
      result = formatWordArray(wordArray, encoding);
    }

    return { result };
  } catch (_err) {
    return { result: '', error: t('hashing.genericError') };
  }
}

/**
 * WebCrypto variant (returns chosen encoding)
 */
async function hashWithWebCrypto(input: string | File, algo: string, encoding: EncodingType): Promise<string> {
  const buffer =
    typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(await input.arrayBuffer());

  const digest = await crypto.subtle.digest(algo, buffer);
  const hashArray = Array.from(new Uint8Array(digest));

  const base64 = btoa(String.fromCharCode(...hashArray));

  switch (encoding) {
    case HASH_ENCODINGS.base64.value:
      return base64;
    case HASH_ENCODINGS.base64url.value:
      return toBase64Url(base64);
    default:
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

function arrayBufferToWordArray(ab: ArrayBuffer) {
  const i8a = new Uint8Array(ab);
  const words: number[] = [];
  for (let i = 0; i < i8a.length; i += 4) {
    words.push((i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | (i8a[i + 3] << 0));
  }
  return CryptoJS.lib.WordArray.create(words, i8a.length);
}
