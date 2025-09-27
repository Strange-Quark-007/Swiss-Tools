import { TranslationFunction } from '@/i18n/utils';

import { CODECS, MODES, Transcode } from '../encoder-decoder/utils';

interface JWTDecodeResult {
  result: {
    header: string;
    payload: string;
  };
  error?: string;
}

export const decodeJWT = async (token: string, t: TranslationFunction): Promise<JWTDecodeResult> => {
  const result = { header: '', payload: '' };

  if (!token) {
    return { result };
  }
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return { result, error: t('jwtDecoder.invalidJwtError') };
    }

    const headerData = await Transcode(parts[0], CODECS.base64.value, MODES.decode.value, t);
    const payloadData = await Transcode(parts[1], CODECS.base64.value, MODES.decode.value, t);

    const header = JSON.parse(headerData.result);
    const payload = JSON.parse(payloadData.result);

    return { result: { header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2) } };
  } catch (_err) {
    return { result: { header: '', payload: '' }, error: t('jwtDecoder.decodeError') };
  }
};
