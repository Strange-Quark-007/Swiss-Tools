import { redirect } from 'next/navigation';

import NumberConversion from '@/features/number-conversion/number-conversion';
import { BASES } from '@/features/number-conversion/utils';
import { getT } from '@/i18n/utils';
import { getFirst } from '@/lib/utils';
import { SearchParams } from '@/types/common';

interface Props {
  searchParams: SearchParams;
}

const validateParams = (params: SearchParams) => {
  const rawFrom = getFirst(params.from);
  const rawTo = getFirst(params.to);

  const isValidBase = (base: string | undefined): base is keyof typeof BASES => {
    return !!base && base in BASES;
  };

  const validFrom = isValidBase(rawFrom) ? rawFrom : 'decimal';
  const validTo = isValidBase(rawTo) ? rawTo : 'decimal';

  if (!isValidBase(rawFrom) || !isValidBase(rawTo)) {
    redirect(`/number-conversion?from=${validFrom}&to=${validTo}`);
  }

  return { from: validFrom, to: validTo };
};

export async function generateMetadata() {
  const t = await getT();

  return {
    title: t('numberConversion.meta.title'),
    description: t('numberConversion.meta.description'),
  };
}

export default async function NumberConversionPage({ searchParams }: Props) {
  const params = await searchParams;
  const { from, to } = validateParams(params);

  return (
    <>
      <NumberConversion from={from} to={to} />
    </>
  );
}
