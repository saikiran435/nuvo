import { Chiku } from "@/components/Chiku";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { storyById } from "@/data/stories";
import { t } from "@/lib/i18n";

export function Soon({ titleKey, bodyKey, storyId }: { titleKey: string; bodyKey: string; storyId?: string }) {
  const story = storyId ? storyById(storyId) : undefined;
  return (
    <Card className="flex flex-col items-start gap-3">
      <Chiku mood="thinking" level={4} size={72} label="Chiku" />
      <h1 className="font-display text-3xl">{story ? story.title : t(titleKey)}</h1>
      <p>{story ? t("soon.storyNamed", { title: story.title }) : t(bodyKey)}</p>
      <ButtonLink href="/learn" variant="ghost">
        {t("soon.back")}
      </ButtonLink>
    </Card>
  );
}
