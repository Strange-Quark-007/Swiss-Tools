import { describe, it, expect } from 'vitest';

import { IDS, MAX_COUNT, generateIDs, IDType } from '../utils';

describe('id-generator utils', () => {
  describe('constants', () => {
    it('should define all 6 supported ID types', () => {
      expect(Object.keys(IDS)).toHaveLength(6);
      expect(IDS.uuidv1.value).toBe('uuidv1');
      expect(IDS.uuidv4.value).toBe('uuidv4');
      expect(IDS.uuidv6.value).toBe('uuidv6');
      expect(IDS.uuidv7.value).toBe('uuidv7');
      expect(IDS.nanoid.value).toBe('nanoid');
      expect(IDS.ulid.value).toBe('ulid');
    });

    it('should define MAX_COUNT as 1000', () => {
      expect(MAX_COUNT).toBe(1000);
    });
  });

  describe('generateIDs', () => {
    const uuidV1Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidV6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

    it('should generate requested count of UUID v1 identifiers', async () => {
      const { result, error } = await generateIDs(IDS.uuidv1.value, 3);
      expect(error).toBe('');
      const ids = result.split('\n');
      expect(ids).toHaveLength(3);
      ids.forEach((id) => expect(id).toMatch(uuidV1Regex));
    });

    it('should generate requested count of UUID v4 identifiers', async () => {
      const { result, error } = await generateIDs(IDS.uuidv4.value, 3);
      expect(error).toBe('');
      const ids = result.split('\n');
      expect(ids).toHaveLength(3);
      ids.forEach((id) => expect(id).toMatch(uuidV4Regex));
    });

    it('should generate requested count of UUID v6 identifiers', async () => {
      const { result, error } = await generateIDs(IDS.uuidv6.value, 3);
      expect(error).toBe('');
      const ids = result.split('\n');
      expect(ids).toHaveLength(3);
      ids.forEach((id) => expect(id).toMatch(uuidV6Regex));
    });

    it('should generate requested count of UUID v7 identifiers', async () => {
      const { result, error } = await generateIDs(IDS.uuidv7.value, 3);
      expect(error).toBe('');
      const ids = result.split('\n');
      expect(ids).toHaveLength(3);
      ids.forEach((id) => expect(id).toMatch(uuidV7Regex));
    });

    it('should generate requested count of Nano ID identifiers', async () => {
      const { result, error } = await generateIDs(IDS.nanoid.value, 4);
      expect(error).toBe('');
      const ids = result.split('\n');
      expect(ids).toHaveLength(4);
      ids.forEach((id) => {
        expect(id).toHaveLength(21);
      });
    });

    it('should generate requested count of ULID identifiers', async () => {
      const { result, error } = await generateIDs(IDS.ulid.value, 3);
      expect(error).toBe('');
      const ids = result.split('\n');
      expect(ids).toHaveLength(3);
      ids.forEach((id) => expect(id).toMatch(ulidRegex));
    });

    it('should handle zero count by returning empty string', async () => {
      const { result, error } = await generateIDs(IDS.uuidv4.value, 0);
      expect(error).toBe('');
      expect(result).toBe('');
    });

    it('should throw an error on unsupported type (exhaustiveCheck)', async () => {
      await expect(generateIDs('unknown-type' as IDType, 1)).rejects.toThrowError(
        'Unexpected case: unknown-type'
      );
    });
  });
});
