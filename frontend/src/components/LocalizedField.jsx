const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "km", label: "ខ្មែរ", short: "KM" },
];

/** EN / KM tab strip used by every multilingual admin form. */
export function LanguageTabs({ value, onChange, className = "" }) {
  return (
    <div className={`inline-flex rounded-xl bg-muted/50 p-1 ${className}`} role="tablist" aria-label="Content language">
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          role="tab"
          aria-selected={value === language.code}
          onClick={() => onChange(language.code)}
          className={`min-h-[38px] rounded-lg px-4 text-xs font-bold transition ${
            value === language.code
              ? "bg-white text-blueberry shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={language.label}
        >
          {language.short}
          <span className="ms-1 hidden sm:inline">{language.label}</span>
        </button>
      ))}
    </div>
  );
}

/** A labelled input that edits one language at a time. */
export function LocalizedField({
  label,
  value = {},
  onChange,
  lang,
  onLangChange,
  textarea = false,
  rows = 3,
  placeholder,
  required = false,
  hint,
}) {
  const current = value?.[lang] ?? "";
  const update = (next) => onChange({ ...(value || {}), [lang]: next });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="field-label mb-0">{label}</label>
        {onLangChange ? <LanguageTabs value={lang} onChange={onLangChange} /> : null}
      </div>

      {textarea ? (
        <textarea
          value={current}
          onChange={(event) => update(event.target.value)}
          rows={rows}
          required={required}
          placeholder={placeholder}
          dir="ltr"
          className="input-field min-h-[96px] resize-y"
        />
      ) : (
        <input
          value={current}
          onChange={(event) => update(event.target.value)}
          required={required}
          placeholder={placeholder}
          dir="ltr"
          className="input-field"
        />
      )}

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
