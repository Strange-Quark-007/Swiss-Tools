import { useT } from '@/i18n/utils';
import { useAppStore } from '@/store/store';
import { AppModuleGroup } from '@/types/app-module';

export const useFavorites = (appModulesList: AppModuleGroup[]): AppModuleGroup => {
  const t = useT();
  const { favorites } = useAppStore();

  const favoriteItems = appModulesList.flatMap((obj) => obj.items).filter((item) => favorites.includes(item.id));

  return { label: t('label.favorites'), items: favoriteItems };
};
