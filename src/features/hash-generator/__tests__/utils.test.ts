import { describe, it, expect, vi } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { HASHING_ALGOS, HASH_ENCODINGS, generateHash, AlgoType, EncodingType } from '../utils';

describe('hash-generator utils', () => {
  const sampleText = 'The quick brown fox jumps over the lazy dog';

  describe('constants', () => {
    it('should define all 10 supported hashing algorithms', () => {
      expect(Object.keys(HASHING_ALGOS)).toHaveLength(10);
      expect(HASHING_ALGOS.md5.value).toBe('md5');
      expect(HASHING_ALGOS.sha1.value).toBe('sha1');
      expect(HASHING_ALGOS.sha224.value).toBe('sha224');
      expect(HASHING_ALGOS.sha256.value).toBe('sha256');
      expect(HASHING_ALGOS.sha384.value).toBe('sha384');
      expect(HASHING_ALGOS.sha512.value).toBe('sha512');
      expect(HASHING_ALGOS.sha3_224.value).toBe('sha3_224');
      expect(HASHING_ALGOS.sha3_256.value).toBe('sha3_256');
      expect(HASHING_ALGOS.sha3_384.value).toBe('sha3_384');
      expect(HASHING_ALGOS.sha3_512.value).toBe('sha3_512');
    });

    it('should define all 3 supported hash encodings', () => {
      expect(Object.keys(HASH_ENCODINGS)).toHaveLength(3);
      expect(HASH_ENCODINGS.hex.value).toBe('hex');
      expect(HASH_ENCODINGS.base64.value).toBe('base64');
      expect(HASH_ENCODINGS.base64url.value).toBe('base64url');
    });
  });

  describe('generateHash - string inputs', () => {
    it('should return empty result when input is empty string or falsy', async () => {
      expect(await generateHash('', HASHING_ALGOS.sha256.value, HASH_ENCODINGS.hex.value, testT)).toEqual({
        result: '',
      });
      expect(
        await generateHash(null as unknown as string, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.hex.value, testT)
      ).toEqual({ result: '' });
    });

    it('should generate MD5 in hex, base64, and base64url encodings', async () => {
      const hex = await generateHash(sampleText, HASHING_ALGOS.md5.value, HASH_ENCODINGS.hex.value, testT);
      expect(hex.result).toBe('9e107d9d372bb6826bd81d3542a419d6');

      const b64 = await generateHash(sampleText, HASHING_ALGOS.md5.value, HASH_ENCODINGS.base64.value, testT);
      expect(b64.result).toBe('nhB9nTcrtoJr2B01QqQZ1g==');

      const b64url = await generateHash(sampleText, HASHING_ALGOS.md5.value, HASH_ENCODINGS.base64url.value, testT);
      expect(b64url.result).toBe('nhB9nTcrtoJr2B01QqQZ1g');
    });

    it('should generate SHA-1 in hex, base64, and base64url encodings', async () => {
      const hex = await generateHash(sampleText, HASHING_ALGOS.sha1.value, HASH_ENCODINGS.hex.value, testT);
      expect(hex.result).toBe('2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');

      const b64 = await generateHash(sampleText, HASHING_ALGOS.sha1.value, HASH_ENCODINGS.base64.value, testT);
      expect(b64.result).toBe('L9ThxnotKPzthJ7hu3bnORuT6xI=');

      const b64url = await generateHash(sampleText, HASHING_ALGOS.sha1.value, HASH_ENCODINGS.base64url.value, testT);
      expect(b64url.result).toBe('L9ThxnotKPzthJ7hu3bnORuT6xI');
    });

    it('should generate SHA-224 hash', async () => {
      const res = await generateHash(sampleText, HASHING_ALGOS.sha224.value, HASH_ENCODINGS.hex.value, testT);
      expect(res.result).toBe('730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525');
    });

    it('should generate SHA-256 in hex, base64, and base64url encodings', async () => {
      const hex = await generateHash(sampleText, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.hex.value, testT);
      expect(hex.result).toBe('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');

      const b64 = await generateHash(sampleText, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.base64.value, testT);
      expect(b64.result).toBe('16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=');

      const b64url = await generateHash(sampleText, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.base64url.value, testT);
      expect(b64url.result).toBe('16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI');
    });

    it('should generate SHA-384 in hex, base64, and base64url encodings', async () => {
      const hex = await generateHash(sampleText, HASHING_ALGOS.sha384.value, HASH_ENCODINGS.hex.value, testT);
      expect(hex.result).toBe(
        'ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1'
      );

      const b64 = await generateHash(sampleText, HASHING_ALGOS.sha384.value, HASH_ENCODINGS.base64.value, testT);
      expect(b64.result).toBe('ynN/EBSkj0wLbdQ8sXewr9nlFpNnVExJQBHjMX2/mlCcseXcHoWpQbvuPX8q+8mx');

      const b64url = await generateHash(sampleText, HASHING_ALGOS.sha384.value, HASH_ENCODINGS.base64url.value, testT);
      expect(b64url.result).toBe('ynN_EBSkj0wLbdQ8sXewr9nlFpNnVExJQBHjMX2_mlCcseXcHoWpQbvuPX8q-8mx');
    });

    it('should generate SHA-512 in hex, base64, and base64url encodings', async () => {
      const hex = await generateHash(sampleText, HASHING_ALGOS.sha512.value, HASH_ENCODINGS.hex.value, testT);
      expect(hex.result).toBe(
        '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6'
      );

      const b64 = await generateHash(sampleText, HASHING_ALGOS.sha512.value, HASH_ENCODINGS.base64.value, testT);
      expect(b64.result).toBe(
        'B+VH2VhvanP3P7rAQ17XaVEhj7fQyNeIownXhUNru2Quk6JSqVTyORJUfR6KO17W4b/XCXghIz+gU489uFT+5g=='
      );

      const b64url = await generateHash(sampleText, HASHING_ALGOS.sha512.value, HASH_ENCODINGS.base64url.value, testT);
      expect(b64url.result).toBe(
        'B-VH2VhvanP3P7rAQ17XaVEhj7fQyNeIownXhUNru2Quk6JSqVTyORJUfR6KO17W4b_XCXghIz-gU489uFT-5g'
      );
    });

    it('should generate all SHA-3 variants (224, 256, 384, 512)', async () => {
      const sha3_224 = await generateHash(sampleText, HASHING_ALGOS.sha3_224.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_224.result).toBe('310aee6b30c47350576ac2873fa89fd190cdc488442f3ef654cf23fe');

      const sha3_256 = await generateHash(sampleText, HASHING_ALGOS.sha3_256.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_256.result).toBe('4d741b6f1eb29cb2a9b9911c82f56fa8d73b04959d3d9d222895df6c0b28aa15');

      const sha3_384 = await generateHash(sampleText, HASHING_ALGOS.sha3_384.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_384.result).toBe(
        '283990fa9d5fb731d786c5bbee94ea4db4910f18c62c03d173fc0a5e494422e8a0b3da7574dae7fa0baf005e504063b3'
      );

      const sha3_512 = await generateHash(sampleText, HASHING_ALGOS.sha3_512.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_512.result).toBe(
        'd135bb84d0439dbac432247ee573a23ea7d3c9deb2a968eb31d47c4fb45f1ef4422d6c531b5b9bd6f449ebcc449ea94d0a8f05f62130fda612da53c79659f609'
      );
    });
  });

  describe('generateHash - File inputs', () => {
    it('should process File inputs using CryptoJS (MD5, SHA-224, SHA-3)', async () => {
      const file = new File([sampleText], 'sample.txt', { type: 'text/plain' });

      const md5 = await generateHash(file, HASHING_ALGOS.md5.value, HASH_ENCODINGS.hex.value, testT);
      expect(md5.result).toBe('9e107d9d372bb6826bd81d3542a419d6');

      const sha224 = await generateHash(file, HASHING_ALGOS.sha224.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha224.result).toBe('730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525');

      const sha3_224 = await generateHash(file, HASHING_ALGOS.sha3_224.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_224.result).toBe('310aee6b30c47350576ac2873fa89fd190cdc488442f3ef654cf23fe');

      const sha3_256 = await generateHash(file, HASHING_ALGOS.sha3_256.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_256.result).toBe('4d741b6f1eb29cb2a9b9911c82f56fa8d73b04959d3d9d222895df6c0b28aa15');

      const sha3_384 = await generateHash(file, HASHING_ALGOS.sha3_384.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_384.result).toBe(
        '283990fa9d5fb731d786c5bbee94ea4db4910f18c62c03d173fc0a5e494422e8a0b3da7574dae7fa0baf005e504063b3'
      );

      const sha3_512 = await generateHash(file, HASHING_ALGOS.sha3_512.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha3_512.result).toBe(
        'd135bb84d0439dbac432247ee573a23ea7d3c9deb2a968eb31d47c4fb45f1ef4422d6c531b5b9bd6f449ebcc449ea94d0a8f05f62130fda612da53c79659f609'
      );
    });

    it('should process File inputs using WebCrypto (SHA-1, SHA-256, SHA-384, SHA-512)', async () => {
      const file = new File([sampleText], 'sample.txt', { type: 'text/plain' });

      const sha1 = await generateHash(file, HASHING_ALGOS.sha1.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha1.result).toBe('2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');

      const sha256 = await generateHash(file, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha256.result).toBe('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');

      const sha384 = await generateHash(file, HASHING_ALGOS.sha384.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha384.result).toBe(
        'ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1'
      );

      const sha512 = await generateHash(file, HASHING_ALGOS.sha512.value, HASH_ENCODINGS.hex.value, testT);
      expect(sha512.result).toBe(
        '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6'
      );
    });
  });

  describe('CryptoJS fallback branch when WebCrypto is unavailable', () => {
    it('should fallback to CryptoJS for SHA-1, SHA-256, SHA-384, and SHA-512 with string input', async () => {
      const subtleSpy = vi
        .spyOn(globalThis.crypto, 'subtle', 'get')
        .mockReturnValue(undefined as unknown as SubtleCrypto);

      try {
        const sha1 = await generateHash(sampleText, HASHING_ALGOS.sha1.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha1.result).toBe('2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');

        const sha256 = await generateHash(sampleText, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha256.result).toBe('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');

        const sha384 = await generateHash(sampleText, HASHING_ALGOS.sha384.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha384.result).toBe(
          'ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1'
        );

        const sha512 = await generateHash(sampleText, HASHING_ALGOS.sha512.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha512.result).toBe(
          '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6'
        );
      } finally {
        subtleSpy.mockRestore();
      }
    });

    it('should fallback to CryptoJS for SHA-1, SHA-256, SHA-384, and SHA-512 with File input', async () => {
      const file = new File([sampleText], 'sample.txt', { type: 'text/plain' });
      const subtleSpy = vi
        .spyOn(globalThis.crypto, 'subtle', 'get')
        .mockReturnValue(undefined as unknown as SubtleCrypto);

      try {
        const sha1 = await generateHash(file, HASHING_ALGOS.sha1.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha1.result).toBe('2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');

        const sha256 = await generateHash(file, HASHING_ALGOS.sha256.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha256.result).toBe('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');

        const sha384 = await generateHash(file, HASHING_ALGOS.sha384.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha384.result).toBe(
          'ca737f1014a48f4c0b6dd43cb177b0afd9e5169367544c494011e3317dbf9a509cb1e5dc1e85a941bbee3d7f2afbc9b1'
        );

        const sha512 = await generateHash(file, HASHING_ALGOS.sha512.value, HASH_ENCODINGS.hex.value, testT);
        expect(sha512.result).toBe(
          '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6'
        );
      } finally {
        subtleSpy.mockRestore();
      }
    });
  });

  describe('error handling and edge cases', () => {
    it('should return error when file arrayBuffer rejects', async () => {
      const brokenFile = {
        arrayBuffer: () => Promise.reject(new Error('Disk read failure')),
      } as unknown as File;

      const res = await generateHash(brokenFile, HASHING_ALGOS.md5.value, HASH_ENCODINGS.hex.value, testT);
      expect(res.error).toBe(testT('hashGenerator.genericError'));
      expect(res.result).toBe('');
    });

    it('should return error when unsupported algorithm is passed (exhaustiveCheck algo)', async () => {
      const res = await generateHash('sample', 'unsupported-algo' as AlgoType, HASH_ENCODINGS.hex.value, testT);
      expect(res.error).toBe(testT('hashGenerator.genericError'));
      expect(res.result).toBe('');
    });

    it('should return error when unsupported encoding is passed (exhaustiveCheck encoding)', async () => {
      const res = await generateHash('sample', HASHING_ALGOS.md5.value, 'unsupported-encoding' as EncodingType, testT);
      expect(res.error).toBe(testT('hashGenerator.genericError'));
      expect(res.result).toBe('');
    });
  });
});
