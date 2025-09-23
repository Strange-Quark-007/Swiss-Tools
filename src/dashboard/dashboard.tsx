import { FlexContainer } from '@/components/content-layout/flex-container';
import { Heading } from '@/components/typography/heading';
import { Paragraph } from '@/components/typography/paragraph';
import { Text } from '@/components/typography/text';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { appModules } from '@/constants/appModules';
import { getT } from '@/i18n/utils';
import { AppModuleItem } from '@/types/app-module';

export const Dashboard = async () => {
  const t = await getT();
  const modules = appModules(t);

  return (
    <FlexContainer direction="col" className="px-16">
      <section className="flex flex-col gap-6 items-center text-center py-10 bg-background">
        <Heading className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance">
          Build Your Toolbox
        </Heading>
        <Paragraph className="text-lg font-medium text-balance max-w-2xl">
          Browse the full list of tools and manage your favorites for quick access.
        </Paragraph>
      </section>

      <div className="flex flex-col gap-16">
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
      </div>
    </FlexContainer>
  );
};

const ModuleCard = ({ id, icon: Icon, name, description }: AppModuleItem) => {
  return (
    <Card
      key={id}
      className="h-22 flex flex-row items-center p-4 rounded-lg border hover:shadow-lg hover:border-primary transition gap-4"
    >
      <div className="p-2 rounded-md bg-secondary">
        <Icon />
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <CardTitle className="truncate">{name}</CardTitle>
        <CardContent className="px-0">
          <Text variant="small" muted className="line-clamp-2 text-wrap truncate">
            {description}
          </Text>
        </CardContent>
      </div>
    </Card>
  );
};
