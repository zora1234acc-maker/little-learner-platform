import { useTranslation } from "react-i18next";

export function PageHeader({ title, eyebrow, description, actions }) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      {eyebrow && (
        <span className="eyebrow">{eyebrow}</span>
      )}
      <h1 className="text-2xl font-bold text-blueberry mb-2">{title}</h1>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      {actions && (
        <div className="flex flex-wrap gap-3">{actions}</div>
      )}
    </div>
  );
}
