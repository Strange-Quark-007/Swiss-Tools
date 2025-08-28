import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';
import { PageContainer } from '@/components/content-layout/page-container';
import { EncoderDecoder } from '@/features/encoder-decoder/encoder-decoder';
import { CODECS, MODES } from '@/features/encoder-decoder/utils';
import { validateEncoderParams } from '@/lib/validate-params';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('encoderDecoder.meta.title'),
    description: t('encoderDecoder.meta.description'),
  };
}

export default async function EncoderDecoderPage({ searchParams }: Props) {
  const t = await getT();
  const params = await searchParams;
  const { codec, mode } = validateEncoderParams(
    params,
    CODECS,
    CODECS.base64.value,
    MODES.ENCODE,
    ROUTES.ENCODER_DECODER
  );

  const items = [
    { label: t('encoderDecoder.name'), href: ROUTES.ENCODER_DECODER },
    { label: `${mode.toUpperCase()} → ${CODECS[codec].label}` },
  ];

  return (
    <PageContainer>
      <AppBreadcrumb items={items} />
      <EncoderDecoder codec={codec} mode={mode} />
    </PageContainer>
  );
}
