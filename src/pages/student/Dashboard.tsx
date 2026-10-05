import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";
import CourseCard from "@/components/CourseCard";
import {
  LayoutDashboard, BookOpen, Compass, TrendingUp,
  MessageSquare, User, GraduationCap, Clock, Award, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getStudentEnrollments } from "@/lib/firestore";


export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;
      try {
        const data = await getStudentEnrollments(user.id);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
          </h2>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Enrolled Courses" value={courses.length} icon={<BookOpen className="w-5 h-5" />} color="primary" />
              <DashboardCard title="Hours Learned" value="0" icon={<Clock className="w-5 h-5" />} color="info" />
              <DashboardCard title="Certificates" value={0} icon={<Award className="w-5 h-5" />} color="accent" />
              <DashboardCard title="Avg. Progress" value="0%" icon={<GraduationCap className="w-5 h-5" />} color="success" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Continue Learning</h3>
                <button onClick={() => navigate("/student/courses")} className="text-sm text-primary hover:underline">
                  View all
                </button>
              </div>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      instructor={course.instructorName}
                      thumbnail={course.thumbnail}
                      progress={course.progress || 0}
                      lessons={course.lessons?.length || 0}
                      onAction={() => navigate(`/student/learn/${course.id}`)}
                      actionLabel="Continue"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center text-pretty">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Compass className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">No enrolled courses</h4>
                  <p className="text-muted-foreground mb-6">Explore our catalog and find something new to learn.</p>
                  <button
                    onClick={() => navigate("/student/browse")}
                    className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

