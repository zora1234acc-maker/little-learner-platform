import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Pencil, Plus, Search, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { Avatar } from "@/components/Avatar";

const emptyForm = {
  full_name: "",
  email: "",
  role: "student",
  preferred_lang: "en",
  is_active: true,
  avatar_url: "",
  year_level: "",
  class_name: "",
  login_pin: "",
  phone: "",
};

const roleStyles = {
  admin: "border-blueberry/30 bg-blueberry/10 text-blueberry",
  teacher: "border-sunshine/40 bg-sunshine/15 text-[#8A6200]",
  student: "border-mint/30 bg-mint/10 text-[#16735D]",
  parent: "border-sky/30 bg-sky/10 text-[#2B6CB0]",
};

export function AdminUsers() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("accounts");
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState({ student_parent: [], teacher_student: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [roster, setRoster] = useState({ students: [], classes: [] });
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const load = async () => {
    const [userRes, linkRes, rosterRes] = await Promise.all([
      api.users.list(),
      api.users.links.list(),
      api.users.students(),
    ]);
    setUsers(userRes.data);
    setLinks(linkRes.data);
    setRoster(rosterRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // The roster query is the source of truth for the student view; the other
  // roles keep the client-side filtering they have always used.
  const filtered = useMemo(() => {
    if (roleFilter === "student") {
      const needle = search.trim().toLowerCase();
      return roster.students.filter((user) => {
        const matchesSearch =
          !needle ||
          user.full_name?.toLowerCase().includes(needle) ||
          user.email?.toLowerCase().includes(needle);
        const matchesClass = classFilter === "all" || user.class_name === classFilter;
        return matchesSearch && matchesClass;
      });
    }

    const needle = search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !needle ||
        user.full_name?.toLowerCase().includes(needle) ||
        user.email?.toLowerCase().includes(needle);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, roster, search, roleFilter, classFilter]);

  const byRole = (role) => users.filter((user) => user.role === role);

  const hasFilters =
    search.trim() !== "" || roleFilter !== "all" || classFilter !== "all";

  // FR-018: clear every search/filter criterion in one action.
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setClassFilter("all");
  };

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setErrors({});
    setModal({ type: "create" });
  };

  const openEdit = (user) => {
    // Year level is read from year_level, falling back to the legacy grade key.
    setForm({
      ...emptyForm,
      ...user,
      year_level: user.year_level || user.grade || "",
      login_pin: user.login_pin || "",
    });
    setError("");
    setErrors({});
    setModal({ type: "edit", id: user.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setErrors({});
    try {
      if (modal.type === "create") {
        await api.users.create(form);
      } else {
        await api.users.update(modal.id, form);
      }
      setModal(null);
      await load();
    } catch (err) {
      // Per-field messages are rendered against their own input; everything
      // else falls back to a single banner. The form values are left alone.
      const apiError = err?.response?.data?.error;
      if (apiError?.fields) {
        setErrors(apiError.fields);
      } else if (apiError?.code === "exists") {
        setError(t("admin.users.errors.exists"));
      } else {
        setError(apiError?.message || t("common.error"));
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    await api.users.update(user.id, { is_active: !user.is_active });
    load();
  };

  const removeUser = async (user) => {
    // FR-019: the confirmation must name the student and state that the
    // removal is permanent and that nothing can be recovered.
    const confirmed = window.confirm(
      t("admin.users.confirm_remove_permanent", { name: user.full_name })
    );
    if (!confirmed) return;
    await api.users.remove(user.id);
    await load();
  };

  const addLink = async (type, payload) => {
    if (!payload) return;
    await api.users.links.create(payload);
    await load();
    void type;
  };

  const removeLink = async (payload) => {
    await api.users.links.remove(payload);
    load();
  };

  const userName = (id) => users.find((user) => user.id === id)?.full_name || id;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow={t("nav.users")} title={t("admin.users.title")} description={t("admin.users.description_short")} />
        <div className="animate-pulse py-20 text-center text-muted-foreground">{t("admin.users.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.users")}
        title={t("admin.users.title")}
        description={t("admin.users.description")}
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <UserPlus className="h-4 w-4" /> {t("admin.users.add_user")}
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("accounts")}
          className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-bold ${
            tab === "accounts" ? "bg-blueberry text-white" : "border border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          <Users className="h-4 w-4" /> {t("admin.users.accounts")} ({users.length})
        </button>
        <button
          onClick={() => setTab("links")}
          className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-bold ${
            tab === "links" ? "bg-blueberry text-white" : "border border-border bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          <Link2 className="h-4 w-4" /> {t("admin.users.links")} ({links.student_parent.length + links.teacher_student.length})
        </button>
      </div>

      {tab === "accounts" ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("admin.users.search")}
                aria-label={t("admin.users.search")}
                className="input-field ps-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                if (event.target.value !== "student") setClassFilter("all");
              }}
              aria-label={t("admin.users.role")}
              className="input-field sm:w-44"
            >
              <option value="all">{t("admin.users.all_roles")}</option>
              <option value="admin">{t("admin.users.admin_role")}</option>
              <option value="teacher">{t("admin.users.teacher_role")}</option>
              <option value="student">{t("admin.users.student_role")}</option>
              <option value="parent">{t("admin.users.parent_role")}</option>
            </select>
            {/* The class filter is derived from the values already in the roster. */}
            {roleFilter === "student" ? (
              <select
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
                aria-label={t("admin.users.class_name")}
                className="input-field sm:w-44"
              >
                <option value="all">{t("admin.users.all_classes")}</option>
                {roster.classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            ) : null}
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-ghost min-h-[44px] px-4"
              >
                {t("admin.users.clear_filters")}
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((user) => (
              <article key={user.id} className="card-md flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${roleStyles[user.role]}`}>
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                      user.is_active
                        ? "border-mint/30 bg-mint/10 text-[#16735D]"
                        : "border-border bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-mint" : "bg-muted-foreground"}`} />
                    {user.is_active ? t("admin.users.active") : t("admin.users.inactive")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar_url} name={user.avatar || user.role} size="lg" />
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-foreground">{user.full_name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    {user.role === "student" ? (
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                        {(user.year_level || user.grade) || "Grade 1"} · {user.class_name || "1A"}
                        {user.login_pin ? ` · PIN ${user.login_pin}` : ""}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <button onClick={() => openEdit(user)} className="btn-secondary min-h-[40px] flex-1 px-3 py-2 text-sm">
                    <Pencil className="h-3.5 w-3.5" /> {t("admin.users.edit")}
                  </button>
                  <button
                    onClick={() => toggleActive(user)}
                    className="min-h-[40px] rounded-lg border border-border px-3 text-xs font-bold text-muted-foreground hover:bg-accent"
                  >
                    {user.is_active ? t("admin.users.deactivate") : t("admin.users.activate")}
                  </button>
                  <button
                    onClick={() => removeUser(user)}
                    className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum"
                    title={t("admin.users.delete")}
                    aria-label={`${t("admin.users.delete")} ${user.full_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center text-muted-foreground">{t("admin.users.no_accounts")}</div>
          ) : null}
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <LinkCard
            title={t("admin.links.parents_children")}
            description={t("admin.links.see_progress")}
            people={byRole("parent")}
            secondaryPeople={byRole("student")}
            primaryKey="parent_id"
            secondaryKey="student_id"
            existing={links.student_parent}
            onAdd={(payload) => addLink("parent", payload)}
            onRemove={(payload) => removeLink(payload)}
            nameOf={userName}
          />

          <LinkCard
            title={t("admin.links.teachers_students")}
            description={t("admin.links.teacher_data")}
            people={byRole("teacher")}
            secondaryPeople={byRole("student")}
            primaryKey="teacher_id"
            secondaryKey="student_id"
            existing={links.teacher_student}
            onAdd={(payload) => addLink("teacher", payload)}
            onRemove={(payload) => removeLink(payload)}
            nameOf={userName}
          />
        </div>
      )}

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? t("admin.users.edit_title") : t("admin.users.create_title")}
        description={t("admin.users.modal_description")}
        wide
      >
        <form onSubmit={save} className="space-y-4">
          {error ? (
            <p className="rounded-xl border border-bubblegum/40 bg-bubblegum/10 px-4 py-3 text-sm text-bubblegum">{error}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="student-full-name">{t("admin.users.full_name")}</label>
              <input
                id="student-full-name"
                value={form.full_name}
                onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                className="input-field"
                aria-invalid={Boolean(errors.full_name)}
                aria-describedby={errors.full_name ? "error-full-name" : undefined}
                required
              />
              <FieldError id="error-full-name" message={errors.full_name} />
            </div>
            <div>
              <label className="field-label" htmlFor="student-email">{t("admin.users.email")}</label>
              <input
                id="student-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="input-field"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "error-email" : undefined}
                required
              />
              <FieldError id="error-email" message={errors.email} />
            </div>
            <div>
              <label className="field-label">{t("admin.users.role")}</label>
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                className="input-field"
              >
                <option value="admin">{t("admin.users.admin_role")}</option>
                <option value="teacher">{t("admin.users.teacher_role")}</option>
                <option value="student">{t("admin.users.student_role")}</option>
                <option value="parent">{t("admin.users.parent_role")}</option>
              </select>
            </div>
            <div>
              <label className="field-label">{t("admin.users.preferred_lang")}</label>
              <select
                value={form.preferred_lang}
                onChange={(event) => setForm({ ...form, preferred_lang: event.target.value })}
                className="input-field"
              >
                <option value="en">{t("common.english")}</option>
                <option value="km">ខ្មែរ</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            {form.role === "student" ? (
              <>
                <div>
                  <label className="field-label" htmlFor="student-year-level">{t("admin.users.year_level")}</label>
                  <input
                    id="student-year-level"
                    value={form.year_level || ""}
                    onChange={(event) => setForm({ ...form, year_level: event.target.value })}
                    className="input-field"
                    placeholder={t("admin.users.year_level_placeholder")}
                    aria-invalid={Boolean(errors.year_level)}
                    aria-describedby={errors.year_level ? "error-year-level" : undefined}
                    required
                  />
                  <FieldError id="error-year-level" message={errors.year_level} />
                </div>
                <div>
                  <label className="field-label" htmlFor="student-class">{t("admin.users.class_name")}</label>
                  <input
                    id="student-class"
                    value={form.class_name || ""}
                    onChange={(event) => setForm({ ...form, class_name: event.target.value })}
                    className="input-field"
                    placeholder={t("admin.users.class_placeholder")}
                    aria-invalid={Boolean(errors.class_name)}
                    aria-describedby={errors.class_name ? "error-class-name" : undefined}
                    required
                  />
                  <FieldError id="error-class-name" message={errors.class_name} />
                </div>
                <div>
                  <label className="field-label" htmlFor="student-pin">{t("admin.users.login_pin")}</label>
                  <input
                    id="student-pin"
                    value={form.login_pin || ""}
                    onChange={(event) => setForm({ ...form, login_pin: event.target.value })}
                    className="input-field font-mono tracking-widest"
                    placeholder="1234"
                    inputMode="numeric"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{t("admin.users.pin_hint")}</p>
                </div>
              </>
            ) : null}

            <div>
              <label className="field-label">{t("admin.users.phone")}</label>
              <input
                value={form.phone || ""}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="input-field"
                placeholder="+855 ..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">{t("admin.users.avatar")}</label>
              <div className="flex flex-wrap gap-2">
                {["", "/asset/images/user.png", "/asset/images/user2.png"].map((url) => (
                  <button
                    key={url || "emoji"}
                    type="button"
                    onClick={() => setForm({ ...form, avatar_url: url })}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${
                      form.avatar_url === url ? "border-blueberry bg-blueberry/10 text-blueberry" : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <Avatar src={url} name={form.avatar || form.role} size="xs" />
                    {url ? url.split("/").pop() : t("admin.users.emoji")}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active !== false}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
                className="h-4 w-4 rounded border-border text-blueberry"
              />
              {t("admin.users.is_active")}
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={() => setModal(null)} className="btn-ghost">
              {t("admin.users.cancel")}
            </button>
            <button type="submit" disabled={saving} className="btn-primary min-h-[44px] px-6 py-2.5">
              <ShieldCheck className="h-4 w-4" /> {saving ? t("admin.users.saving") : t("admin.users.save")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// A single message rendered directly under the input it belongs to (FR-009).
// The data layer returns human-readable English; known messages are mapped to
// translation keys so validation feedback follows the selected language (FR-026).
const fieldErrorKeys = {
  "Name is required.": "admin.users.errors.full_name",
  "Sign-in identity is required.": "admin.users.errors.email_required",
  "Enter a valid email address.": "admin.users.errors.email_invalid",
  "Year level is required.": "admin.users.errors.year_level",
  "Class is required.": "admin.users.errors.class_name",
};

function FieldError({ id, message }) {
  const { t } = useTranslation();
  if (!message) return null;
  const key = fieldErrorKeys[message];
  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-bubblegum">
      {key ? t(key) : message}
    </p>
  );
}

function LinkCard({ title, description, people, secondaryPeople, primaryKey, secondaryKey, existing, onAdd, onRemove, nameOf }) {
  const { t } = useTranslation();
  const [primary, setPrimary] = useState(people[0]?.id || "");
  const [secondary, setSecondary] = useState(secondaryPeople[0]?.id || "");

  return (
    <section className="card-md">
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <select value={primary} onChange={(event) => setPrimary(event.target.value)} className="input-field">
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.full_name}
            </option>
          ))}
        </select>
        <select value={secondary} onChange={(event) => setSecondary(event.target.value)} className="input-field">
          {secondaryPeople.map((person) => (
            <option key={person.id} value={person.id}>
              {person.full_name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => onAdd({ [primaryKey]: primary, [secondaryKey]: secondary })}
        className="btn-secondary mt-3 w-full min-h-[44px] px-4 py-2.5 text-sm"
      >
        <Plus className="h-4 w-4" /> {t("admin.links.link")}
      </button>

      <div className="mt-4 space-y-2">
        {existing.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("admin.links.no_links")}</p>
        ) : (
          existing.map((link) => (
            <div key={`${link[primaryKey]}-${link[secondaryKey]}`} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <span>
                {nameOf(link[primaryKey])} <span className="text-muted-foreground">↔</span> {nameOf(link[secondaryKey])}
              </span>
              <button
                type="button"
                onClick={() => onRemove(link)}
                className="rounded p-1.5 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum"
                aria-label={t("admin.links.remove")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
