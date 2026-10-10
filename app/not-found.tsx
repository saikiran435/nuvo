import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-3 p-6">
      <h1 className="font-display text-3xl">{t("notFound.title")}</h1>
      <p>{t("notFound.body")}</p>
      <ButtonLink href="/" variant="ghost">
        {t("notFound.home")}
      </ButtonLink>
    </main>
  );
}
