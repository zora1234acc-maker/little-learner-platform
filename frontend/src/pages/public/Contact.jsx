import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, message } from "antd";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { useSite } from "@/context/SiteContext";

export function Contact() {
  const { t } = useTranslation();
  const { lang, settings } = useSite();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const contact = settings?.contact || {};

  useEffect(() => {
    let live = true;
    setLoading(true);
    api.public
      .pages({ slug: "contact", lang })
      .then((res) => live && setPage(res.data))
      .catch(() => live && setPage(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [lang]);

  const handleSubmit = (values) => {
    const recipient = contact.email || "hello@littlelearner.example";
    const subject = encodeURIComponent(`Little Learner contact: ${values.subject}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
    );
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    message.success("Your email app is opening.");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse py-24">
        <div className="h-4 w-24 rounded bg-[#E7E8F0]" />
        <div className="mt-5 h-12 w-2/3 rounded bg-[#E7E8F0]" />
        <div className="mt-4 h-5 w-full max-w-xl rounded bg-[#E7E8F0]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-[#E7E8F0] bg-gradient-to-br from-white to-[#F0EEFF] px-6 py-12 sm:px-10 lg:px-14">
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#FFF1B9] blur-2xl" />
        <div className="relative max-w-3xl">
          <span className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8D90A4]">
            <MessageCircle className="h-4 w-4 text-[#514BFF]" />
            {t("nav.contact")}
          </span>
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#30325F] sm:text-6xl">
            We’re here to help you keep learning.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#777A91] sm:text-lg">
            Have a question about lessons, accounts, or child privacy? Send us a message and
            we’ll point you in the right direction.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl bg-[#30325F] p-7 text-white">
            <h2 className="text-2xl font-extrabold">{t("admin.cms.settings")}</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Our team is happy to help families, teachers, and school administrators.
            </p>
            <div className="mt-7 space-y-4 text-sm">
              {contact.email && (
                <a className="flex items-start gap-3 text-white/85 hover:text-[#FFD75E]" href={`mailto:${contact.email}`}>
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD75E]" />
                  <span>{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a className="flex items-start gap-3 text-white/85 hover:text-[#FFD75E]" href={`tel:${contact.phone}`}>
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD75E]" />
                  <span>{contact.phone}</span>
                </a>
              )}
              {contact.address && (
                <div className="flex items-start gap-3 text-white/85">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD75E]" />
                  <span>{contact.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E8F0] bg-white p-6">
            <ShieldCheck className="h-6 w-6 text-[#1B9A75]" />
            <h2 className="mt-4 font-extrabold text-[#30325F]">{t("home.privacy.title")}</h2>
            <p className="mt-2 text-sm leading-7 text-[#777A91]">
              Read how we protect children’s privacy and keep the platform focused.
            </p>
            <Link to="/privacy-for-children" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#514BFF]">
              Read privacy promise <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <div className="rounded-2xl border border-[#E7E8F0] bg-white p-6 shadow-[0_14px_32px_-28px_rgba(48,50,95,0.5)] sm:p-8">
          <div className="mb-7">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8D90A4]">{t("common.submit")}</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#30325F]">{t("home.privacy.link")}</h2>
          </div>
          <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Form.Item label="Your name" name="name" rules={[{ required: true, message: "Please enter your name." }]}>
                <Input placeholder="Your name" />
              </Form.Item>
              <Form.Item label="Email address" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email." }]}>
                <Input placeholder="you@example.com" />
              </Form.Item>
            </div>
            <Form.Item label="Subject" name="subject" rules={[{ required: true, message: "Please add a subject." }]}>
              <Input placeholder="What can we help with?" />
            </Form.Item>
            <Form.Item label="Message" name="message" rules={[{ required: true, message: "Please write a message." }]}>
              <Input.TextArea rows={6} placeholder="Tell us a little more..." />
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<ArrowRight className="h-4 w-4" />}>
              Open email
            </Button>
          </Form>
          <p className="mt-4 text-xs leading-6 text-[#8D90A4]">
            This form opens your email app. We do not store contact messages in the browser.
          </p>
        </div>
      </section>

      {page?.sections?.map((section) => (
        <div
          key={section.id}
          className="prose prose-sm mx-auto max-w-3xl leading-8 text-[#555A77]"
          dangerouslySetInnerHTML={{ __html: section.content || "" }}
        />
      ))}
    </div>
  );
}
