import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useSite } from "../context/SiteContext";

export function Footer() {
  const { t } = useTranslation();
  const { settings, menus, footerBlocks, lang } = useSite();

  const contact = settings?.contact || {};
  const social = settings?.social || {};
  const footerLinks = (menus?.footer || []).filter((item) => !item.parent_id);

  return (
    <footer className="mt-auto border-t border-[#24264A] bg-[#292B50] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="absolute left-1 top-1 h-5 w-5 rounded-sm bg-[#8DD34F]" />
              <span className="absolute left-2.5 top-2.5 h-5 w-5 rounded-sm border-2 border-[#F472B6] bg-[#F9A8D4]" />
              <span className="absolute left-3.5 top-3.5 h-5 w-5 rounded-sm border-2 border-[#38BDF8] bg-[#60A5FA]" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              {settings?.site_name || "Little Learner"}
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
            {settings?.tagline?.[lang] || settings?.tagline?.en || t("site.tagline")}
          </p>

          <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/[0.08] px-4 py-2 text-xs font-bold text-[#A9EEDC]">
            <ShieldCheck className="h-4 w-4" /> {t("home.privacy.point1")} · {t("home.privacy.point2")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
              {t("nav.menu")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href || item.url || "/"}
                    className="text-white/75 transition hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/about" className="text-white/75 transition hover:text-white hover:underline">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
              {t("nav.contact")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {contact.email ? (
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD75E]" />
                  <a href={`mailto:${contact.email}`} className="hover:text-white hover:underline">
                    {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phone ? (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD75E]" />
                  <span>{contact.phone}</span>
                </li>
              ) : null}
              {contact.address ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD75E]" />
                  <span>{contact.address}</span>
                </li>
              ) : null}
            </ul>

            {(social.facebook || social.telegram) && (
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
                {social.facebook ? (
                  <a href={social.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
                    Facebook
                  </a>
                ) : null}
                {social.telegram ? (
                  <a href={social.telegram} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/20">
                    Telegram
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {footerBlocks.length > 0 && (
        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:px-8">
            {footerBlocks.map((block) => (
              <div key={block.id}>
                <h4 className="text-sm font-bold text-white">{block.title}</h4>
                <p className="mt-2 text-sm leading-7 text-white/60">{block.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} {settings?.site_name || "Little Learner"}. {t("site.tagline")}
          </span>
          <span>{t("home.privacy.point1")} · {t("home.privacy.point2")} · {t("home.privacy.point3")}</span>
        </div>
      </div>
    </footer>
  );
}
