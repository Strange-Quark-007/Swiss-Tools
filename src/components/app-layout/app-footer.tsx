import { Dot } from 'lucide-react';
import Link from 'next/link';

import StrangeQuark from '@/assets/icons/StrangeQuark';
import { ROUTES } from '@/constants/routes';
import { getT } from '@/i18n/utils';

import { Text } from '../typography/text';
import { ButtonBase } from '../ui/button-base';

export const Footer = async () => {
  const { t } = await getT();

  return (
    <footer className="mt-auto w-full h-auto sm:h-16 p-4 border-t bg-background/95 dark:shadow-secondary">
      <div className="flex flex-col h-full sm:flex-row justify-center items-center gap-2">
        <div className="flex items-center gap-2">
          <Text className="text-foreground/80">{t('label.developedBy')}:</Text>
          <div className="flex items-center gap-2">
            <Link href="https://github.com/Strange-Quark-007">
              <StrangeQuark className="w-6 h-6 fill-foreground/75 custom-transition-color" />
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <Dot className="custom-transition-color" />
          <ButtonBase variant="link" className="p-0" asChild>
            <Link href={ROUTES.PRIVACY}>
              <Text variant="small" className="font-semibold text-foreground/75">
                {t('label.privacy')}
              </Text>
            </Link>
          </ButtonBase>
          <Dot className="custom-transition-color" />
        </div>
        <div>
          <Text variant="small" className="font-semibold text-foreground/75 text-center lg:text-right">
            {t('footer.copyright')}
          </Text>
        </div>
      </div>
    </footer>
  );
};
