import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";

export function TeacherClassProgress() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    api.progress
      .class(user.id)
      .then((result) => live && setStudents(result.data))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [user.id]);

  const totalCompleted = students.reduce((sum, student) => sum + (student.progress?.completed || 0), 0);
  const totalOverdue = students.reduce((sum, student) => sum + (student.progress?.overdue || 0), 0);
  const scored = students.filter((student) => (student.progress?.avgScore || 0) > 0);
  const averageScore = scored.length
    ? Math.round(scored.reduce((sum, student) => sum + student.progress.avgScore, 0) / scored.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("nav.classProgress")}
        title="Track your students"
        description="Completion, average scores and overdue work for every linked student."
        actions={
          <Link to="/teacher/assign" className="btn-primary touch-target">
            Create assignment
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("teacher.class_progress.students")}</span>
            <Users className="h-4 w-4 text-blueberry" />
          </div>
          <div className="mt-1 text-3xl font-black text-foreground">{students.length}</div>
        </div>
        <div className="card-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("teacher.class_progress.completed")}</span>
            <CheckCircle2 className="h-4 w-4 text-[#16735D]" />
          </div>
          <div className="mt-1 text-3xl font-black text-[#16735D]">{totalCompleted}</div>
        </div>
        <div className="card-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("teacher.class_progress.average_score")}</span>
            <span className="text-xs font-bold text-muted-foreground">/100</span>
          </div>
          <div className="mt-1 text-3xl font-black text-blueberry">{averageScore}%</div>
        </div>
        <div className="card-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("teacher.class_progress.overdue")}</span>
            <Clock className="h-4 w-4 text-bubblegum" />
          </div>
          <div className="mt-1 text-3xl font-black text-bubblegum">{totalOverdue}</div>
        </div>
      </div>

      <div className="card-md overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-bold">{t("teacher.class_progress.student_col")}</th>
              <th className="px-4 py-3 text-center font-bold">{t("teacher.class_progress.completed")}</th>
              <th className="px-4 py-3 text-center font-bold">{t("teacher.class_progress.average_col")}</th>
              <th className="px-4 py-3 text-center font-bold">{t("teacher.class_progress.overdue")}</th>
              <th className="px-4 py-3 font-bold">{t("teacher.class_progress.status_col")}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const progress = student.progress || {};
              const percent = progress.total
                ? Math.round(((progress.completed || 0) / progress.total) * 100)
                : 0;
              return (
                <tr key={student.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <Avatar src={student.avatar_url} name={student.avatar} size="sm" />
                      <span>
                        <span className="block font-bold text-foreground">{student.full_name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {student.grade || "Grade 1"} · {student.class_name || "1A"}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="mx-auto w-28">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {progress.completed || 0}/{progress.total || 0}
                        </span>
                        <span>{percent}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted/40">
                        <div className="h-full rounded-full bg-blueberry" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-bold ${
                        (progress.avgScore || 0) >= 70 ? "text-[#16735D]" : "text-muted-foreground"
                      }`}
                    >
                      {progress.avgScore ? `${progress.avgScore}%` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {progress.overdue ? (
                      <span className="font-bold text-bubblegum">{progress.overdue}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {progress.overdue ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-bubblegum/20 bg-bubblegum/10 px-2.5 py-1 text-[11px] font-bold text-bubblegum">
                        <Clock className="h-3 w-3" /> {t("teacher.class_progress.needs_attention")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[11px] font-bold text-[#16735D]">
                        <CheckCircle2 className="h-3 w-3" /> {t("teacher.class_progress.on_track")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No students are linked to you yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground">{t("teacher.class_progress.loading")}</p>
      ) : null}
    </div>
  );
}
