import { describe, it, expect } from 'vitest';

import { testT } from '@/test-helpers/i18n';

import { decodeJWT } from '../utils';

describe('jwt-decoder utils', () => {
  const sampleHeader = { alg: 'HS256', typ: 'JWT' };
  const samplePayload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };

  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  describe('decodeJWT', () => {
    it('should return empty result when token is empty string', async () => {
      const res = await decodeJWT('', testT);
      expect(res).toEqual({
        result: {
          header: '',
          payload: '',
        },
      });
    });

    it('should return invalidJwtError when token has fewer than 2 parts', async () => {
      const res = await decodeJWT('single-part-token-without-dot', testT);
      expect(res.error).toBe(testT('jwtDecoder.invalidJwtError'));
      expect(res.result).toEqual({
        header: '',
        payload: '',
      });
    });

    it('should decode and format a valid 3-part JWT token', async () => {
      const res = await decodeJWT(validToken, testT);

      expect(res.error).toBeUndefined();
      expect(res.result.header).toBe(JSON.stringify(sampleHeader, null, 2));
      expect(res.result.payload).toBe(JSON.stringify(samplePayload, null, 2));
    });

    it('should decode and format a 2-part JWT token without signature', async () => {
      const twoPartToken = 'eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIn0';
      const res = await decodeJWT(twoPartToken, testT);

      expect(res.error).toBeUndefined();
      expect(res.result.header).toBe(JSON.stringify({ alg: 'none' }, null, 2));
      expect(res.result.payload).toBe(JSON.stringify({ sub: '1234567890' }, null, 2));
    });

    it('should return decodeError when parts contain valid base64 that is not JSON', async () => {
      // "hello world" in base64: "aGVsbG8gd29ybGQ="
      const nonJsonToken = 'aGVsbG8gd29ybGQ=.aGVsbG8gd29ybGQ=';
      const res = await decodeJWT(nonJsonToken, testT);

      expect(res.error).toBe(testT('jwtDecoder.decodeError'));
      expect(res.result).toEqual({
        header: '',
        payload: '',
      });
    });

    it('should return decodeError when parts contain invalid base64 characters', async () => {
      const corruptedToken = '???invalid-header???.???invalid-payload???';
      const res = await decodeJWT(corruptedToken, testT);

      expect(res.error).toBe(testT('jwtDecoder.decodeError'));
      expect(res.result).toEqual({
        header: '',
        payload: '',
      });
    });
  });
});
