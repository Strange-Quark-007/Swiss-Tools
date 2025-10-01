'use client';

import { Star } from 'lucide-react';

import { Heading } from '@/components/typography/heading';
import { Text } from '@/components/typography/text';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { appModules } from '@/constants/appModules';
import { useModuleNavigation } from '@/hooks/use-module-navigation';
import { useT } from '@/i18n/utils';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/store';
import * as Types from '@/types/app-module';

const ModuleCard = ({ id, icon: Icon, name, description }: Types.AppModuleItem) => {
  const { t } = useT();
  const navigate = useModuleNavigation();
  const { favorites, addFavorite, removeFavorite } = useAppStore();

  const isFavorite = favorites.includes(id);

  const handleFavorite = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <Card
      key={id}
      onClick={() => navigate(id)}
      className="h-22 flex flex-row items-center p-4 rounded-lg border hover:shadow-lg hover:border-primary hover:cursor-pointer gap-4"
    >
      <div className="p-2 rounded-md bg-secondary">
        <Icon />
      </div>
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <CardTitle className="truncate">{name}</CardTitle>
        <CardContent className="px-0">
          <Text variant="small" muted className="line-clamp-2 text-wrap truncate">
            {description}
          </Text>
        </CardContent>
      </div>
      <Star
        aria-label={isFavorite ? t('label.addFavorite') : t('label.removeFavorite')}
        className={cn(
          'w-5',
          isFavorite ? 'fill-accent-foreground hover:fill-primary-foreground' : 'hover:fill-primary'
        )}
        onClick={handleFavorite}
      />
    </Card>
  );
};

export const ModulesList = () => {
  const { t } = useT();
  const modules = appModules(t);
  return (
    <>
      {modules.map((group) => (
        <section key={group.label} className="flex flex-col gap-4">
          <Heading level={2} className="tracking-wide">
            {group.label}
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map((item) => (
              <ModuleCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};
