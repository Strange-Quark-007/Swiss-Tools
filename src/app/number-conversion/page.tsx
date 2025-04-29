import { redirect } from 'next/navigation';

import { NumberConversion } from '@/features/number-conversion/number-conversion';
import { BASES } from '@/features/number-conversion/utils';
import { getFirst } from '@/lib/utils';
import { getT } from '@/i18n/utils';
import { SearchParams } from '@/types/common';
import { AppBreadcrumb } from '@/components/app-layout/app-breadcrumb';

interface Props {
  searchParams: Promise<SearchParams>;
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
  const t = await getT();
  const params = await searchParams;
  const { from, to } = validateParams(params);

  const items = [
    { label: t('numberConversion.name'), href: '/number-conversion' },
    { label: `${BASES[from].label} ⮞ ${BASES[to].label}` },
  ];

  return (
    <div className="flex flex-1 flex-col h-11/12 p-4 gap-4">
      <AppBreadcrumb items={items} />
      <NumberConversion from={from} to={to} />
    </div>
  );
}
