import { useTranslation } from "react-i18next";

export function PageHeader({ title, eyebrow, description, actions }) {
  const { t } = useTranslation();

  return (
    <div className="mb-9">
      {eyebrow && (
        <span className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8D90A4]">
          <span className="h-px w-6 bg-[#B7B4E8]" />
          {eyebrow}
        </span>
      )}
      <h1 className="mb-2 text-3xl font-extrabold tracking-[-0.03em] text-[#30325F]">{title}</h1>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      {actions && (
        <div className="flex flex-wrap gap-3">{actions}</div>
      )}
    </div>
  );
}
