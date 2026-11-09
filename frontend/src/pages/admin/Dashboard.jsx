import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, FileText, GraduationCap, Mail, Palette, Users } from "lucide-react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/context/AuthContext";

export function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState({ users: [], subjects: [], lessons: [], submissions: [], grades: [], pages: [] });

  useEffect(() => {
    let live = true;
    Promise.all([
      api.users.list(),
      api.content.subjects.list(),
      api.content.lessons.list(),
      api.grading.submissions.list(),
      api.grading.grades.list(),
      api.cms.pages.list(),
    ]).then(([users, subjects, lessons, submissions, grades, pages]) => {
      if (!live) return;
      setData({
        users: users.data,
        subjects: subjects.data,
        lessons: lessons.data,
        submissions: submissions.data,
        grades: grades.data,
        pages: pages.data,
      });
    });
    return () => {
      live = false;
    };
  }, []);

  const pending = data.submissions.filter((submission) => !submission.graded);
  const students = data.users.filter((item) => item.role === "student");

  const stats = [
    { label: t("nav.users"), value: data.users.length, hint: `${students.length} students`, icon: Users, color: "text-blueberry", to: "/admin/users" },
    { label: t("nav.content"), value: data.lessons.length + data.subjects.length, hint: `${data.lessons.length} lessons`, icon: GraduationCap, color: "text-[#B07A00]", to: "/admin/content" },
    { label: "CMS pages", value: data.pages.length, hint: "Editable without code", icon: Palette, color: "text-[#2B6CB0]", to: "/admin/cms" },
    { label: t("nav.grading"), value: pending.length, hint: `${data.grades.length} graded`, icon: Mail, color: "text-bubblegum", to: "/admin/grading" },
  ];

  const quickLinks = [
    { to: "/admin/users", label: "Create a user", icon: Users, desc: "Admin, teacher, student or parent" },
    { to: "/admin/content/subjects", label: "Build a course", icon: BookOpen, desc: "Subjects → courses → lessons" },
    { to: "/admin/cms/pages", label: "Edit website pages", icon: FileText, desc: "English, Khmer and Arabic" },
    { to: "/admin/grading", label: "Grade submissions", icon: Mail, desc: `${pending.length} waiting for review` },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t("nav.dashboard")}
        title="Admin Dashboard"
        description="Manage users, content, the public website and grading from one place."
        actions={
          <div className="flex items-center gap-3 rounded-2xl border border-[#E7E8F0] bg-white px-4 py-2">
            <Avatar src={user?.avatar_url} name={user?.avatar || "admin"} size="sm" />
            <div>
              <p className="text-sm font-bold text-foreground">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground">Signed in as admin</p>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.to} className="group rounded-2xl border border-[#E7E8F0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#C8C5F2] hover:shadow-[0_14px_30px_-24px_rgba(48,50,95,0.5)]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8D90A4]">{stat.label}</span>
                  <div className="mt-1 text-3xl font-black text-[#30325F]">{stat.value}</div>
                  <p className="mt-1 text-xs text-[#8D90A4]">{stat.hint}</p>
                </div>
                <span className="rounded-xl bg-[#F0EFFF] p-2.5 text-[#514BFF]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Quick actions</h3>
            <span className="text-xs text-muted-foreground">Most used</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  className="rounded-xl border border-border bg-background p-4 transition hover:border-blueberry/30 hover:bg-blueberry/5"
                >
                  <Icon className="h-4 w-4 text-blueberry" />
                  <p className="mt-2 text-sm font-bold text-foreground">{link.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{link.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent students</h3>
            <Link to="/admin/users" className="text-xs font-bold text-blueberry hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {students.slice(0, 4).map((student) => (
              <div key={student.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
                <Avatar src={student.avatar_url} name={student.avatar || "student"} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{student.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.grade || "Grade 1"} · PIN {student.login_pin || "—"}
                  </p>
                </div>
                <span className="rounded-full bg-mint/10 px-2 py-1 text-[11px] font-bold text-[#16735D]">Active</span>
              </div>
            ))}
            {students.length === 0 ? <p className="text-sm text-muted-foreground">No students yet.</p> : null}
          </div>
        </section>
      </div>

      <section className="card-md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Latest submissions</h3>
          <Link to="/admin/grading" className="text-xs font-bold text-blueberry hover:underline">
            Open grading queue
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Student</th>
                <th className="px-4 py-3 font-bold">Assignment</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 text-end font-bold">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.submissions.slice(-5).reverse().map((submission) => (
                <tr key={submission.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <Avatar src={submission.student_avatar_url} name={submission.student_name} size="xs" />
                      {submission.student_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{submission.assignment_title?.en || "Assignment"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${submission.graded ? "bg-mint/10 text-[#16735D]" : "bg-sunshine/20 text-[#8A6200]"}`}>
                      {submission.graded ? "Graded" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end font-bold">
                    {data.grades.find((grade) => grade.submission?.id === submission.id)?.score ?? "—"}
                  </td>
                </tr>
              ))}
              {data.submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No submissions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
