import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/public/Home";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Subjects } from "@/pages/public/Subjects";
import { CourseDetail } from "@/pages/public/CourseDetail";
import { LessonList } from "@/pages/public/LessonList";
import { LessonPlayer } from "@/pages/public/LessonPlayer";
import { QuizTaker } from "@/pages/public/QuizTaker";
import { About } from "@/pages/public/About";
import { Contact } from "@/pages/public/Contact";
import { Login } from "@/pages/public/Login";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SiteProvider } from "@/context/SiteContext";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AdminUsers } from "@/pages/admin/Users";
import { AdminContent } from "@/pages/admin/Content";
import { AdminCMS } from "@/pages/admin/CMS";
import { AdminGrading } from "@/pages/admin/Grading";
import { TeacherLibrary } from "@/pages/teacher/Library";
import { TeacherAssign } from "@/pages/teacher/Assign";
import { TeacherClassProgress } from "@/pages/teacher/ClassProgress";
import { StudentTodo } from "@/pages/student/Todo";
import { StudentProgress } from "@/pages/student/Progress";
import { ParentChildren } from "@/pages/parent/Children";
import { ParentChildProgress } from "@/pages/parent/ChildProgress";
import "@/index.css";

// Role-based wrapper
function RoleRoute({ element: Element, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return <Element />;
}

export function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <LanguageSwitcher />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/courses/:subjectId" element={<CourseDetail />} />
              <Route path="/courses/:courseId/lessons" element={<LessonList />} />
              <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
              <Route path="/quiz/:quizId" element={<QuizTaker />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              {/* Student */}
              <Route path="/student/todo" element={<RoleRoute allowedRoles={["student"]} element={<StudentTodo />} />} />
              <Route path="/student/progress" element={<RoleRoute allowedRoles={["student"]} element={<StudentProgress />} />} />

              {/* Teacher */}
              <Route path="/teacher/library" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherLibrary />} />} />
              <Route path="/teacher/assign" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherAssign />} />} />
              <Route path="/teacher/assign/:courseId" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherAssign />} />} />
              <Route path="/teacher/grading" element={<RoleRoute allowedRoles={["teacher","admin"]} element={<AdminGrading />} />} />
              <Route path="/teacher/class-progress" element={<RoleRoute allowedRoles={["teacher"]} element={<TeacherClassProgress />} />} />

              {/* Parent */}
              <Route path="/parent" element={<RoleRoute allowedRoles={["parent"]} element={<ParentChildren />} />} />
              <Route path="/parent/child/:childId" element={<RoleRoute allowedRoles={["parent"]} element={<ParentChildProgress />} />} />

              {/* Admin */}
              <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]} element={<AdminDashboard />} />} />
              <Route path="/admin/users" element={<RoleRoute allowedRoles={["admin"]} element={<AdminUsers />} />} />
              <Route path="/admin/content" element={<RoleRoute allowedRoles={["admin"]} element={<AdminContent />} />} />
              <Route path="/admin/cms" element={<RoleRoute allowedRoles={["admin"]} element={<AdminCMS />} />} />
              <Route path="/admin/grading" element={<RoleRoute allowedRoles={["admin","teacher"]} element={<AdminGrading />} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </SiteProvider>
    </AuthProvider>
  );
}
