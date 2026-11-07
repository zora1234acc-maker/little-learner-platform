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
import "@/index.css";

// Role-based wrapper
function RoleRoute({ element: Element, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return <Element />;
}

// Public routes (no auth required)
function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route path="/courses/:subjectId" element={<CourseDetail />} />
      <Route path="/courses/:courseId/lessons" element={<LessonList />} />
      <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
      <Route path="/quiz/:quizId" element={<QuizTaker />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:slug" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Auth-required routes (student dashboard)
function StudentRoutes() {
  return (
    <Routes>
      <Route path="/student" element={<RoleRoute allowedRoles={["student"]} element={<div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Student Dashboard</h1><p className="text-muted-foreground">Welcome, student!</p></div>} />} />
      <Route path="/student/todo" element={<RoleRoute allowedRoles={["student"]} element={<TodoPage />} />} />
      <Route path="/student/assign/:assignmentId" element={<RoleRoute allowedRoles={["student"]} element={<div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Assignment</h1><p className="text-muted-foreground">Assignment detail view.</p></div>} />} />
      <Route path="/student/progress" element={<RoleRoute allowedRoles={["student"]} element={<ProgressPage />} />} />
    </Routes>
  );
}

// Teacher routes
function TeacherRoutes() {
  return (
    <Routes>
      <Route path="/teacher" element={<RoleRoute allowedRoles={["teacher"]} element={<div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Teacher Dashboard</h1><p className="text-muted-foreground">Welcome, teacher!</p></div>} />} />
      <Route path="/teacher/library" element={<RoleRoute allowedRoles={["teacher"]} element={<LibraryPage />} />} />
      <Route path="/teacher/assign" element={<RoleRoute allowedRoles={["teacher"]} element={<AssignPage />} />} />
      <Route path="/teacher/assign/:courseId" element={<RoleRoute allowedRoles={["teacher"]} element={<AssignPage />} />} />
      <Route path="/teacher/grading" element={<RoleRoute allowedRoles={["teacher"]} element={<GradingPage />} />} />
      <Route path="/teacher/class-progress" element={<RoleRoute allowedRoles={["teacher"]} element={<ClassProgressPage />} />} />
    </Routes>
  );
}

// Parent routes
function ParentRoutes() {
  return (
    <Routes>
      <Route path="/parent" element={<RoleRoute allowedRoles={["parent"]} element={<ChildrenPage />} />} />
      <Route path="/parent/child/:childId" element={<RoleRoute allowedRoles={["parent"]} element={<ChildProgressPage />} />} />
    </Routes>
  );
}

// Admin routes
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]} element={<AdminDashboardPage />} />} />
      <Route path="/admin/users" element={<RoleRoute allowedRoles={["admin"]} element={<UsersPage />} />} />
      <Route path="/admin/content" element={<RoleRoute allowedRoles={["admin"]} element={<ContentPage />} />} />
      <Route path="/admin/cms" element={<RoleRoute allowedRoles={["admin"]} element={<CMSPage />} />} />
      <Route path="/admin/grading" element={<RoleRoute allowedRoles={["admin","teacher"]} element={<GradingPage />} />} />
    </Routes>
  );
}

// Lazy page imports (inline for now)
function TodoPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">My To-do</h1><p className="text-muted-foreground">Student assignments.</p></div>; }
function ProgressPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">My Progress</h1><p className="text-muted-foreground">Student progress.</p></div>; }
function LibraryPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Library</h1><p className="text-muted-foreground">Browse content to assign.</p></div>; }
function AssignPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Create Assignment</h1><p className="text-muted-foreground">Assign work to students.</p></div>; }
function GradingPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Grading Queue</h1><p className="text-muted-foreground">Grade submissions.</p></div>; }
function ClassProgressPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Class Progress</h1><p className="text-muted-foreground">Track students.</p></div>; }
function ChildrenPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">My Children</h1><p className="text-muted-foreground">Parent dashboard.</p></div>; }
function ChildProgressPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Child Progress</h1><p className="text-muted-foreground">View child details.</p></div>; }
function AdminDashboardPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Admin Dashboard</h1><p className="text-muted-foreground">Admin overview.</p></div>; }
function UsersPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Users</h1><p className="text-muted-foreground">Manage accounts.</p></div>; }
function ContentPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Content Library</h1><p className="text-muted-foreground">Build courses.</p></div>; }
function CMSPage() { return <div className="p-4"><h1 className="text-2xl font-bold text-blueberry">Website CMS</h1><p className="text-muted-foreground">Edit public site.</p></div>; }

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
