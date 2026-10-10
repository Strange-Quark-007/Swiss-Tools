import { describe, it, expect } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { CODECS, MODES, transcode, CodecType } from '../utils';

describe('encoder-decoder utils', () => {
  describe('constants', () => {
    it('should define valid MODES with inverse relationships', () => {
      expect(MODES.encode.value).toBe('encode');
      expect(MODES.encode.inverse).toBe('decode');
      expect(MODES.decode.value).toBe('decode');
      expect(MODES.decode.inverse).toBe('encode');
    });

    it('should define all 12 supported CODECS with proper metadata', () => {
      const keys = Object.keys(CODECS);
      expect(keys).toHaveLength(12);

      expect(CODECS.base2.value).toBe('base2');
      expect(CODECS.base8.value).toBe('base8');
      expect(CODECS.base16.value).toBe('base16');
      expect(CODECS.base32.value).toBe('base32');
      expect(CODECS.base58.value).toBe('base58');
      expect(CODECS.base62.value).toBe('base62');
      expect(CODECS.base64.value).toBe('base64');
      expect(CODECS.ascii85.value).toBe('ascii85');
      expect(CODECS.base91.value).toBe('base91');
      expect(CODECS.base128.value).toBe('base128');
      expect(CODECS.url.value).toBe('url');
      expect(CODECS.html.value).toBe('html');

      expect(CODECS.base128.tooltip).toBeDefined();
      expect(CODECS.base128.tooltip?.messageKey).toBe('encoderDecoder.base128Warning');
    });
  });

  describe('transcode', () => {
    it('should return empty result when input text is empty or whitespace', async () => {
      expect(await transcode('', CODECS.base64.value, MODES.encode.value, testT)).toEqual({ result: '' });
      expect(await transcode('   ', CODECS.base64.value, MODES.encode.value, testT)).toEqual({ result: '' });
      expect(await transcode('\n\t', CODECS.base64.value, MODES.decode.value, testT)).toEqual({ result: '' });
    });

    it('should transcode base2 (Binary) back and forth', async () => {
      const sample = 'Hello';
      const encoded = await transcode(sample, CODECS.base2.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('01001000 01100101 01101100 01101100 01101111');

      const decoded = await transcode(encoded.result, CODECS.base2.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base8 (Octal) back and forth', async () => {
      const sample = 'Hello';
      const encoded = await transcode(sample, CODECS.base8.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('110 145 154 154 157');

      const decoded = await transcode(encoded.result, CODECS.base8.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base16 (Hex) back and forth', async () => {
      const sample = 'Hello';
      const encoded = await transcode(sample, CODECS.base16.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('48656c6c6f');

      const decoded = await transcode(encoded.result, CODECS.base16.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base32 back and forth', async () => {
      const sample = 'Hello';
      const encoded = await transcode(sample, CODECS.base32.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('JBSWY3DP');

      const decoded = await transcode(encoded.result, CODECS.base32.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base58 back and forth', async () => {
      const sample = 'Hello';
      const encoded = await transcode(sample, CODECS.base58.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('9Ajdvzr');

      const decoded = await transcode(encoded.result, CODECS.base58.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base62 back and forth', async () => {
      const sample = 'Hello';
      const encoded = await transcode(sample, CODECS.base62.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('5TP3P3v');

      const decoded = await transcode(encoded.result, CODECS.base62.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base64 back and forth', async () => {
      const sample = 'Hello World';
      const encoded = await transcode(sample, CODECS.base64.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('SGVsbG8gV29ybGQ=');

      const decoded = await transcode(encoded.result, CODECS.base64.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode ascii85 back and forth', async () => {
      const sample = 'Hello World!';
      const encoded = await transcode(sample, CODECS.ascii85.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('87cURD]i,"Ebo80');

      const decoded = await transcode(encoded.result, CODECS.ascii85.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should return error when ascii85 decoding encounters invalid input', async () => {
      const res = await transcode('<~unterminated-delimiter', CODECS.ascii85.value, MODES.decode.value, testT);
      expect(res.error).toBe(testT('encoderDecoder.genericError'));
      expect(res.result).toBe('');
    });

    it('should transcode base91 back and forth', async () => {
      const sample = 'Hello World';
      const encoded = await transcode(sample, CODECS.base91.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('>OwJh>Io0Tv!lE');

      const decoded = await transcode(encoded.result, CODECS.base91.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode base128 back and forth', async () => {
      const sample = 'Hello World';
      const encoded = await transcode(sample, CODECS.base128.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();

      const decoded = await transcode(encoded.result, CODECS.base128.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should transcode url encoding back and forth', async () => {
      const sample = 'https://example.com/search?q=hello world & special=#';
      const encoded = await transcode(sample, CODECS.url.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%20%26%20special%3D%23');

      const decoded = await transcode(encoded.result, CODECS.url.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should return error when url decode encounters malformed URI sequence', async () => {
      const res = await transcode('%E0%A4%A', CODECS.url.value, MODES.decode.value, testT);
      expect(res.error).toBe(testT('encoderDecoder.genericError'));
      expect(res.result).toBe('');
    });

    it('should transcode html entities back and forth', async () => {
      const sample = 'Hello & "World"';
      const encoded = await transcode(sample, CODECS.html.value, MODES.encode.value, testT);
      expect(encoded.error).toBeUndefined();
      expect(encoded.result).toBe('&#72;&#101;&#108;&#108;&#111;&#32;&#38;&#32;&#34;&#87;&#111;&#114;&#108;&#100;&#34;');

      const decoded = await transcode(encoded.result, CODECS.html.value, MODES.decode.value, testT);
      expect(decoded.error).toBeUndefined();
      expect(decoded.result).toBe(sample);
    });

    it('should return error when decode result is empty or whitespace-only', async () => {
      // Decode a sequence of spaces in HTML: "&#32;&#32;" yields "  " which fails !result.trim()
      const res = await transcode('&#32;&#32;', CODECS.html.value, MODES.decode.value, testT);
      expect(res.error).toBe(testT('encoderDecoder.genericError'));
      expect(res.result).toBe('');
    });

    it('should return error on decoding invalid characters in base58', async () => {
      const res = await transcode('0OIl', CODECS.base58.value, MODES.decode.value, testT);
      expect(res.error).toBe(testT('encoderDecoder.genericError'));
      expect(res.result).toBe('');
    });

    it('should return error on decoding invalid characters in base62', async () => {
      const res = await transcode('invalid-+-chars', CODECS.base62.value, MODES.decode.value, testT);
      expect(res.error).toBe(testT('encoderDecoder.genericError'));
      expect(res.result).toBe('');
    });

    it('should return error when an unsupported codec is provided (exhaustiveCheck)', async () => {
      const res = await transcode('test', 'unknown-codec' as CodecType, MODES.encode.value, testT);
      expect(res.error).toBe(testT('encoderDecoder.genericError'));
      expect(res.result).toBe('');
    });
  });
});
