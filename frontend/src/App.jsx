import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Layout } from "@/components/Layout";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SimpleLayout } from "@/components/SimpleLayout";
import { Home } from "@/pages/public/Home";

import { Subjects } from "@/pages/public/Subjects";
import { CourseDetail } from "@/pages/public/CourseDetail";
import { LessonList } from "@/pages/public/LessonList";
import { LessonPlayer } from "@/pages/public/LessonPlayer";
import { QuizTaker } from "@/pages/public/QuizTaker";
import { About } from "@/pages/public/About";
import { Contact } from "@/pages/public/Contact";
import { DynamicPage } from "@/pages/public/DynamicPage";
import { Login } from "@/pages/public/Login";
import { Videos } from "@/pages/public/Videos";
import { AuthProvider, useAuth, StudentAccessGuard } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdminUsers } from "@/pages/admin/Users";
import { AdminContent } from "@/pages/admin/Content";
import { AdminContentSubjects } from "@/pages/admin/ContentSubjects";
import { AdminContentCourses } from "@/pages/admin/ContentCourses";
import { AdminContentLessons } from "@/pages/admin/ContentLessons";
import { AdminContentQuizzes } from "@/pages/admin/ContentQuizzes";
import { AdminCMS } from "@/pages/admin/CMS";
import { AdminCmsSettings } from "@/pages/admin/CMSSettings";
import { AdminCmsMenus } from "@/pages/admin/CMSMenus";
import { AdminCmsFooter } from "@/pages/admin/CMSFooter";
import { AdminCmsPages } from "@/pages/admin/CMSPages";
import { AdminCmsMedia } from "@/pages/admin/CMSMedia";
import { AdminGrading } from "@/pages/admin/Grading";
import { TeacherLibrary } from "@/pages/teacher/Library";
import { TeacherAssign } from "@/pages/teacher/Assign";
import { TeacherClassProgress } from "@/pages/teacher/ClassProgress";
import { StudentTodo } from "@/pages/student/Todo";
import { StudentProgress } from "@/pages/student/Progress";
import { AssignmentSubmit } from "@/pages/student/AssignmentSubmit";
import { QuizResult } from "@/pages/student/QuizResult";
import { ParentChildren } from "@/pages/parent/Children";
import { ParentChildProgress } from "@/pages/parent/ChildProgress";
import "@/index.css";

function RoleRoute({ element, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return element;
}

// Guards the per-child parent route: a parent may only view their linked children.
const ParentChildRoute = () => {
  const { childId } = useParams();
  return (
    <StudentAccessGuard studentId={childId}>
      <ParentChildProgress />
    </StudentAccessGuard>
  );
}

export function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#514BFF",
          colorInfo: "#514BFF",
          colorSuccess: "#1B9A75",
          colorWarning: "#D89A21",
          colorError: "#D24F75",
          colorText: "#30325F",
          colorTextSecondary: "#777A91",
          colorBorder: "#E7E8F0",
          colorBgLayout: "#F7F8FC",
          colorBgContainer: "#FFFFFF",
          borderRadius: 12,
          fontFamily: '"Nunito", system-ui, sans-serif',
        },
        components: {
          Button: {
            controlHeight: 44,
            borderRadius: 12,
            fontWeight: 700,
          },
          Input: {
            controlHeight: 48,
            borderRadius: 12,
          },
          Card: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      <AuthProvider>
        <SiteProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="min-h-screen bg-background">
              <Routes>
              {/* Public pages — use Layout with Header + Footer */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/courses/:subjectId" element={<CourseDetail />} />
                <Route path="/courses/:courseId/lessons" element={<LessonList />} />
                <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
                <Route path="/quiz/:quizId" element={<QuizTaker />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-for-children" element={<DynamicPage slug="privacy-for-children" />} />
                <Route path="/data-retention" element={<DynamicPage slug="data-retention" />} />
                <Route path="/pages/:slug" element={<DynamicPage />} />
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Admin — DashboardLayout with sidebar */}
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]} element={<AdminDashboard />} />} />
                <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]} element={<AdminDashboard />} />} />
                <Route path="/admin/users" element={<RoleRoute allowedRoles={["admin"]} element={<AdminUsers />} />} />
                <Route path="/admin/content" element={<RoleRoute allowedRoles={["admin"]} element={<AdminContent />} />} />
                <Route path="/admin/content/subjects" element={<RoleRoute allowedRoles={["admin"]} element={<AdminContentSubjects />} />} />
                <Route path="/admin/content/courses" element={<RoleRoute allowedRoles={["admin"]} element={<AdminContentCourses />} />} />
                <Route path="/admin/content/lessons" element={<RoleRoute allowedRoles={["admin"]} element={<AdminContentLessons />} />} />
                <Route path="/admin/content/quizzes" element={<RoleRoute allowedRoles={["admin"]} element={<AdminContentQuizzes />} />} />
                <Route path="/admin/cms" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCMS />} />} />
                <Route path="/admin/cms/settings" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCmsSettings />} />} />
                <Route path="/admin/cms/menus" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCmsMenus />} />} />
                <Route path="/admin/cms/footer" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCmsFooter />} />} />
                <Route path="/admin/cms/pages" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCmsPages />} />} />
                <Route path="/admin/cms/media" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCmsMedia />} />} />
                <Route path="/admin/grading" element={<RoleRoute allowedRoles={["admin", "teacher"]} element={<AdminGrading />} />} />
              </Route>

              {/* Teacher — DashboardLayout with sidebar */}
              <Route element={<DashboardLayout />}>
                <Route path="/teacher/library" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherLibrary />} />} />
                <Route path="/teacher/assign" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherAssign />} />} />
                <Route path="/teacher/assign/:courseId" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherAssign />} />} />
                <Route path="/teacher/grading" element={<RoleRoute allowedRoles={["teacher", "admin"]} element={<AdminGrading />} />} />
                <Route path="/teacher/class-progress" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherClassProgress />} />} />
              </Route>

              {/* Student — SimpleLayout (no sidebar) */}
              <Route element={<SimpleLayout />}>
                <Route path="/student/todo" element={<RoleRoute allowedRoles={["student"]} element={<StudentTodo />} />} />
                <Route path="/student/progress" element={<RoleRoute allowedRoles={["student"]} element={<StudentProgress />} />} />
                <Route path="/student/assign/:assignmentId" element={<RoleRoute allowedRoles={["student"]} element={<AssignmentSubmit />} />} />
                <Route path="/student/quiz-result/:quizId" element={<RoleRoute allowedRoles={["student"]} element={<QuizResult />} />} />
              </Route>

              {/* Parent — SimpleLayout (no sidebar) */}
              <Route element={<SimpleLayout />}>
                <Route path="/parent" element={<RoleRoute allowedRoles={["parent"]} element={<ParentChildren />} />} />
                <Route path="/parent/child/:childId" element={<RoleRoute allowedRoles={["parent"]} element={<ParentChildRoute />} />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </SiteProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}
