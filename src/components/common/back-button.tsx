'use client';

import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useT } from '@/i18n/utils';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
}

export const BackButton = ({ fallbackUrl = '/', className }: BackButtonProps) => {
  const router = useRouter();
  const { t } = useT();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={
        className ?? 'inline-flex items-center text-sm font-medium text-primary hover:underline cursor-pointer'
      }
      aria-label={t('label.back')}
    >
      <MoveLeft className="w-4 h-4 mr-2" />
      {t('label.back')}
    </button>
  );
};
