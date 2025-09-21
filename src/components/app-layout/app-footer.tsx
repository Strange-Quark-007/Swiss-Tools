import StrangeQuark from '@/assets/icons/StrangeQuark';
import { getT } from '@/i18n/utils';

import { Text } from '../typography/text';

export const Footer = async () => {
  const t = await getT();

  return (
    <footer className="mt-auto w-full bg-background/95 p-4 border-t border-foreground/10 shadow dark:shadow-secondary">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Text className="text-foreground/80">{t('label.developedBy')}:</Text>
          <div className="flex items-center gap-2 text-foreground/80">
            <StrangeQuark className="w-6 h-6 fill-foreground/80" />
            <Text className="font-semibold">{t('developer.nickName')}</Text>
          </div>
        </div>

        <Text variant="small" className="font-semibold text-foreground/70 text-center lg:text-right">
          {t('footer.copyright')}
        </Text>
      </div>
    </footer>
  );
};
