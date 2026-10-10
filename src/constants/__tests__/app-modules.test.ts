import { LayoutDashboard } from 'lucide-react';
import { describe, it, expect } from 'vitest';

import { ROUTES } from '@/constants/routes';
import { StringUtils } from '@/lib/string-utils';
import { testT } from '@/test-helpers/i18n';

import { AppModuleGroupId, appModules, staticModule } from '../appModules';

const getModuleKeyPrefix = (route: string): string => {
  const segment = route.startsWith('/unit-converter/')
    ? `${route.replace('/unit-converter/', '')}-converter`
    : route.slice(1);

  return StringUtils.from(segment).parseFromKebab().toCamelCase().toString();
};

describe('appModules constants', () => {
  describe('AppModuleGroupId', () => {
    it('should have correct enum values', () => {
      expect(AppModuleGroupId.DASHBOARD).toBe('dashboard');
      expect(AppModuleGroupId.FAVORITES).toBe('favorites');
      expect(AppModuleGroupId.CONVERTERS).toBe('converters');
      expect(AppModuleGroupId.SECURITY).toBe('security');
      expect(AppModuleGroupId.GENERATORS).toBe('generators');
      expect(AppModuleGroupId.DESIGN).toBe('design');
      expect(AppModuleGroupId.UNIT_CONVERTERS).toBe('unit_converters');
    });
  });

  describe('staticModule', () => {
    it('should return the static dashboard module group with translated label and icon', () => {
      const group = staticModule(testT);

      expect(group.id).toBe(AppModuleGroupId.DASHBOARD);
      expect(group.label).toBe(testT('dashboard.name'));
      expect(group.items).toHaveLength(1);

      const item = group.items[0];
      expect(item.id).toBe(ROUTES.DASHBOARD);
      expect(item.name).toBe(testT('dashboard.name'));
      expect(item.description).toBe('');
      expect(item.icon).toBe(LayoutDashboard);
    });
  });

  describe('appModules', () => {
    it('should return all functional module groups in expected order', () => {
      const groups = appModules(testT);

      expect(groups.map((g) => g.id)).toEqual([
        AppModuleGroupId.CONVERTERS,
        AppModuleGroupId.SECURITY,
        AppModuleGroupId.GENERATORS,
        AppModuleGroupId.DESIGN,
        AppModuleGroupId.UNIT_CONVERTERS,
      ]);
    });

    it('should ensure every module group and item matches testT(key) with unique routes', () => {
      const groups = appModules(testT);
      const allRouteIds: ROUTES[] = [];

      groups.forEach((group) => {
        const groupKey = StringUtils.from(group.id).parseFromSnake().toCamelCase().toString();
        expect(group.label).toBe(testT(`label.${groupKey}`));
        expect(group.items.length).toBeGreaterThan(0);

        group.items.forEach((item) => {
          expect(Object.values(ROUTES)).toContain(item.id);
          allRouteIds.push(item.id);

          const keyPrefix = getModuleKeyPrefix(item.id);
          expect(item.name).toBe(testT(`${keyPrefix}.name`));
          expect(item.description).toBe(testT(`${keyPrefix}.description`));
          expect(item.icon).toBeDefined();
        });
      });

      expect(allRouteIds.length).toBe(new Set(allRouteIds).size);
    });
  });
});
