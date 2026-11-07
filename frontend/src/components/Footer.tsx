import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-muted/50 mt-auto py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{t("site.name")}</span>
          <span className="text-xs opacity-60">&middot;</span>
          <span>Free learning for every child</span>
        </div>
        <div className="flex items-center gap-4 text-xs opacity-70">
          <span>{t("nav.about")}</span>
          <span>{t("nav.contact")}</span>
          <span>No ads &bull; No trackers</span>
        </div>
      </div>
    </footer>
  );
}
