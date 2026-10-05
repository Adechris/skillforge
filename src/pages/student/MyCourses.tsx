import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Compass, TrendingUp, MessageSquare, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentEnrollments } from "@/lib/firestore";


export default function StudentCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;
      try {
        const enrollments = await getStudentEnrollments(user.id);
        setCourses(enrollments);
      } catch (error) {
        console.error("Error fetching my courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [user]);

  return (
    <DashboardLayout title="My Courses">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
          <p className="text-muted-foreground">Track your enrolled courses</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.courseId}
                title={course.title}
                instructor={course.instructorName}
                thumbnail={course.thumbnail}
                progress={course.progress || 0}
                lessons={course.lessons?.length || 0}
                rating={course.rating}
                onAction={() => navigate(`/student/learn/${course.courseId}`)}
                actionLabel="Continue Learning"
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">You haven't enrolled yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              You haven't joined any courses yet. Explore our catalog to start your learning journey.
            </p>
            <button
              onClick={() => navigate("/student/browse")}
              className="px-8 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md"
            >
              Start Browsing
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
