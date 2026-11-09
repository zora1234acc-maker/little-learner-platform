import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Modal } from "@/components/Modal";
import { LocalizedField } from "@/components/LocalizedField";
import { useSite } from "@/context/SiteContext";

const emptyQuiz = {
  lesson_id: "",
  title: { en: "", km: "", ar: "" },
  description: { en: "", km: "", ar: "" },
  position: 1,
  is_published: true,
};

const emptyQuestion = {
  text: { en: "", km: "", ar: "" },
  options: [
    { text: { en: "", km: "", ar: "" }, is_correct: true },
    { text: { en: "", km: "", ar: "" }, is_correct: false },
    { text: { en: "", km: "", ar: "" }, is_correct: false },
    { text: { en: "", km: "", ar: "" }, is_correct: false },
  ],
};

export function AdminContentQuizzes() {
  const { t } = useTranslation();
  const { lang } = useSite();
  const [rows, setRows] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [langTab, setLangTab] = useState("en");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyQuiz);
  const [saving, setSaving] = useState(false);

  const [questionModal, setQuestionModal] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState(null);
  const [questionLang, setQuestionLang] = useState("en");
  const [questionSaving, setQuestionSaving] = useState(false);

  const load = async () => {
    const [quizRes, lessonRes] = await Promise.all([api.content.quizzes.list(), api.content.lessons.list()]);
    setRows(quizRes.data);
    setLessons(lessonRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const lessonName = (id) => {
    const lesson = lessons.find((item) => item.id === id);
    return lesson?.title?.[lang] || lesson?.title?.en || "—";
  };

  const loadQuestions = async (quizId) => {
    const result = await api.content.questions.list(quizId);
    setQuestions(result.data);
  };

  const openCreate = () => {
    setForm({ ...emptyQuiz, lesson_id: lessons[0]?.id || "", position: rows.length + 1 });
    setModal({ type: "create" });
  };

  const openEdit = (quiz) => {
    setForm({
      lesson_id: quiz.lesson_id,
      title: quiz.title,
      description: quiz.description || { en: "", km: "", ar: "" },
      position: quiz.position ?? 1,
      is_published: quiz.is_published !== false,
    });
    setModal({ type: "edit", id: quiz.id });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    if (modal.type === "create") await api.content.quizzes.create(form);
    else await api.content.quizzes.update(modal.id, form);
    setModal(null);
    setSaving(false);
    await load();
  };

  const remove = async (quiz) => {
    if (window.confirm(`Delete "${quiz.title?.en}"? Its questions are removed too.`)) {
      await api.content.quizzes.remove(quiz.id);
      await load();
    }
  };

  const openQuestions = async (quiz) => {
    setQuestionModal(quiz);
    setQuestionForm(null);
    await loadQuestions(quiz.id);
  };

  const openNewQuestion = () => {
    setQuestionForm({
      ...emptyQuestion,
      options: emptyQuestion.options.map((option, index) => ({ ...option, id: `o${Date.now()}${index}`, text: { en: "", km: "", ar: "" } })),
    });
  };

  const openEditQuestion = (question) => {
    setQuestionForm({
      id: question.id,
      text: question.text,
      options: (question.options || []).map((option) => ({ ...option, text: option.text || { en: "", km: "", ar: "" } })),
    });
  };

  const updateQuestionOption = (index, patch) => {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, i) => (i === index ? { ...option, ...patch } : option)),
    }));
  };

  const setCorrectOption = (index) => {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, i) => ({ ...option, is_correct: i === index })),
    }));
  };

  const saveQuestion = async () => {
    if (!questionForm) return;
    setQuestionSaving(true);
    const payload = {
      quiz_id: questionModal.id,
      text: questionForm.text,
      options: questionForm.options.map((option, index) => ({
        ...option,
        id: option.id || `o${Date.now()}${index}`,
      })),
    };
    if (questionForm.id) await api.content.questions.update(questionForm.id, payload);
    else await api.content.questions.create(payload);
    setQuestionForm(null);
    setQuestionSaving(false);
    await loadQuestions(questionModal.id);
  };

  const removeQuestion = async (question) => {
    if (window.confirm("Delete this question?")) {
      await api.content.questions.remove(question.id);
      await loadQuestions(questionModal.id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.content")}
        title="Quizzes"
        description="Multiple-choice quizzes with server-side scoring in the real API. Questions are translated too."
        actions={
          <button onClick={openCreate} className="btn-primary touch-target">
            <Plus className="h-4 w-4" /> Add quiz
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((quiz) => (
          <article key={quiz.id} className="card-md">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sunshine/25 text-[#8A6200]">
                <HelpCircle className="h-5 w-5" />
              </span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${quiz.is_published !== false ? "bg-mint/10 text-[#16735D]" : "bg-muted/40 text-muted-foreground"}`}>
                {quiz.is_published !== false ? "Published" : "Draft"}
              </span>
            </div>
            <h3 className="mt-3 font-bold text-foreground">{quiz.title?.[lang] || quiz.title?.en}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{quiz.description?.[lang] || quiz.description?.en}</p>
            <p className="mt-1 text-xs text-muted-foreground">Lesson: {lessonName(quiz.lesson_id)}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => openQuestions(quiz)} className="btn-secondary min-h-[40px] flex-1 px-3 py-2 text-sm">
                <HelpCircle className="h-3.5 w-3.5" /> Questions
              </button>
              <button onClick={() => openEdit(quiz)} className="btn-ghost min-h-[40px] px-3 py-2 text-sm">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={() => remove(quiz)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete quiz">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
        {rows.length === 0 ? <div className="card text-center text-muted-foreground">No quizzes yet.</div> : null}
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.type === "edit" ? "Edit quiz" : "Add quiz"}
        description="Link the quiz to a lesson and translate its title and description."
        wide
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="field-label">Lesson</label>
            <select value={form.lesson_id} onChange={(event) => setForm({ ...form, lesson_id: event.target.value })} className="input-field" required>
              <option value="">Choose a lesson</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>{lesson.title?.en}</option>
              ))}
            </select>
          </div>

          <LocalizedField
            label="Title"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
            lang={langTab}
            onLangChange={setLangTab}
            required
          />
          <LocalizedField
            label="Description"
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
            lang={langTab}
            onLangChange={setLangTab}
            textarea
            rows={3}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Position</label>
              <input type="number" min="1" value={form.position} onChange={(event) => setForm({ ...form, position: Number(event.target.value) })} className="input-field" />
            </div>
            <label className="mt-8 flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={form.is_published !== false} onChange={(event) => setForm({ ...form, is_published: event.target.checked })} className="h-4 w-4 rounded border-border" />
              Published
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button type="button" onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary min-h-[44px] px-6 py-2.5">
              {saving ? "Saving..." : "Save quiz"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(questionModal)}
        onClose={() => setQuestionModal(null)}
        title={questionModal ? `Questions · ${questionModal.title?.en}` : "Questions"}
        description="Each question has answer options. Mark exactly one option as correct."
        wide
      >
        {questionModal ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {["en", "km", "ar"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setQuestionLang(value)}
                    className={`min-h-[36px] rounded-lg px-3 text-xs font-bold uppercase ${
                      questionLang === value ? "bg-blueberry text-white" : "border border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <button onClick={openNewQuestion} className="btn-primary min-h-[40px] px-4 py-2 text-sm">
                <Plus className="h-3.5 w-3.5" /> Add question
              </button>
            </div>

            {questionForm ? (
              <div className="rounded-2xl border border-border bg-background p-4">
                <h4 className="font-bold text-foreground">{questionForm.id ? "Edit question" : "New question"}</h4>

                <div className="mt-3 space-y-3">
                  <div>
                    <label className="field-label">Question text ({questionLang})</label>
                    <input
                      value={questionForm.text?.[questionLang] || ""}
                      onChange={(event) =>
                        setQuestionForm({
                          ...questionForm,
                          text: { ...questionForm.text, [questionLang]: event.target.value },
                        })
                      }
                      className="input-field"
                      dir={questionLang === "ar" ? "rtl" : "ltr"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="field-label">Answer options</label>
                    {questionForm.options.map((option, index) => (
                      <div key={option.id || index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={Boolean(option.is_correct)}
                          onChange={() => setCorrectOption(index)}
                          className="h-4 w-4 shrink-0 accent-blueberry"
                          aria-label={`Mark option ${index + 1} correct`}
                        />
                        <input
                          value={option.text?.[questionLang] || ""}
                          onChange={(event) => updateQuestionOption(index, { text: { ...option.text, [questionLang]: event.target.value } })}
                          className="input-field"
                          placeholder={`Option ${index + 1}`}
                          dir={questionLang === "ar" ? "rtl" : "ltr"}
                        />
                        {questionForm.options.length > 2 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setQuestionForm({
                                ...questionForm,
                                options: questionForm.options.filter((_, i) => i !== index),
                              })
                            }
                            className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum"
                            aria-label="Remove option"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setQuestionForm({
                          ...questionForm,
                          options: [
                            ...questionForm.options,
                            { id: `o${Date.now()}`, text: { en: "", km: "", ar: "" }, is_correct: false },
                          ],
                        })
                      }
                      className="btn-ghost text-xs"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add option
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setQuestionForm(null)} className="btn-ghost">Cancel</button>
                  <button onClick={saveQuestion} disabled={questionSaving} className="btn-primary min-h-[40px] px-5 py-2 text-sm">
                    {questionSaving ? "Saving..." : "Save question"}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              {questions.map((question, index) => (
                <div key={question.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {index + 1}. {question.text?.[questionLang] || question.text?.en}
                    </p>
                    <div className="flex gap-1">
                      <button onClick={() => openEditQuestion(question)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Edit question">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => removeQuestion(question)} className="touch-target rounded-lg p-2 text-muted-foreground hover:bg-bubblegum/10 hover:text-bubblegum" aria-label="Delete question">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {(question.options || []).map((option) => (
                      <li key={option.id} className={`flex items-center gap-2 text-xs ${option.is_correct ? "font-bold text-[#16735D]" : "text-muted-foreground"}`}>
                        {option.is_correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 rounded-full border border-border" />}
                        {option.text?.[questionLang] || option.text?.en}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {questions.length === 0 ? <p className="rounded-xl bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">No questions yet.</p> : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
