import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import InstructorDashboard from "./pages/instructor/Dashboard";
import InstructorCourses from "./pages/instructor/MyCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import InstructorStudents from "./pages/instructor/Students";
import InstructorAnalytics from "./pages/instructor/Analytics";
import InstructorSettings from "./pages/instructor/Settings";
import EditCourse from "./pages/instructor/EditCourse";

import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/MyCourses";
import BrowseCourses from "./pages/student/BrowseCourses";
import CourseLearning from "./pages/student/CourseLearning";
import StudentProgress from "./pages/student/Progress";
import StudentProfile from "./pages/student/Profile";

import MessagesPage from "./pages/shared/Messages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: string }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to={user?.role === "instructor" ? "/instructor" : "/student"} />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* Instructor Routes */}
    <Route path="/instructor" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
    <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><InstructorCourses /></ProtectedRoute>} />
    <Route path="/instructor/create" element={<ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>} />
    <Route path="/instructor/course/:id" element={<ProtectedRoute role="instructor"><EditCourse /></ProtectedRoute>} />
    <Route path="/instructor/students" element={<ProtectedRoute role="instructor"><InstructorStudents /></ProtectedRoute>} />
    <Route path="/instructor/analytics" element={<ProtectedRoute role="instructor"><InstructorAnalytics /></ProtectedRoute>} />
    <Route path="/instructor/messages" element={<ProtectedRoute role="instructor"><MessagesPage variant="instructor" /></ProtectedRoute>} />
    <Route path="/instructor/settings" element={<ProtectedRoute role="instructor"><InstructorSettings /></ProtectedRoute>} />

    {/* Student Routes */}
    <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
    <Route path="/student/courses" element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>} />
    <Route path="/student/browse" element={<ProtectedRoute role="student"><BrowseCourses /></ProtectedRoute>} />
    <Route path="/student/learn/:id" element={<ProtectedRoute role="student"><CourseLearning /></ProtectedRoute>} />
    <Route path="/student/progress" element={<ProtectedRoute role="student"><StudentProgress /></ProtectedRoute>} />
    <Route path="/student/messages" element={<ProtectedRoute role="student"><MessagesPage variant="student" /></ProtectedRoute>} />
    <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
