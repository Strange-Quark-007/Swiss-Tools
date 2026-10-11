import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { JsonLd } from '@/components/seo/json-ld';
import { SEARCH_PARAM_KEYS } from '@/constants/common';
import { ROUTES } from '@/constants/routes';
import { EncoderDecoder } from '@/features/encoder-decoder/encoder-decoder';
import { CODECS, MODES } from '@/features/encoder-decoder/utils';
import { getT } from '@/i18n/utils';
import { generateBreadcrumbJsonLd, generateToolJsonLd } from '@/lib/json-ld';
import { createToolMetadata } from '@/lib/metadata';
import { validateQueryParams } from '@/lib/validate-params';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  return createToolMetadata(ROUTES.ENCODER_DECODER);
}

export default async function EncoderDecoderPage({ searchParams }: Props) {
  const { t } = await getT();
  const params = await searchParams;

  const config = {
    [SEARCH_PARAM_KEYS.CODEC]: { map: CODECS, default: CODECS.base64.value },
    [SEARCH_PARAM_KEYS.MODE]: { map: MODES, default: MODES.encode.value },
  };

  const { codec, mode } = validateQueryParams(params, config, ROUTES.ENCODER_DECODER);

  const items = [{ label: t('encoderDecoder.name') }, { label: `${mode.toUpperCase()} (${CODECS[codec].label})` }];

  return (
    <PageContainer>
      <JsonLd
        data={generateToolJsonLd({
          name: t('encoderDecoder.name'),
          description: t('encoderDecoder.meta.description'),
          path: ROUTES.ENCODER_DECODER,
          category: 'SecurityApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', url: ROUTES.HOME },
          { name: t('encoderDecoder.name'), url: ROUTES.ENCODER_DECODER },
        ])}
      />
      <AppBreadcrumb items={items} />
      <EncoderDecoder codec={codec} mode={mode} />
    </PageContainer>
  );
}
