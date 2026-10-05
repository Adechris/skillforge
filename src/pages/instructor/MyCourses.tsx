import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, PlusCircle, Users, BarChart3, MessageSquare, Settings, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getInstructorCourses } from "@/lib/firestore";


export default function InstructorCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        const data = await getInstructorCourses(user.id);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  return (
    <DashboardLayout title="My Courses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
            <p className="text-muted-foreground">Manage and edit your courses</p>
          </div>
          <button
            onClick={() => navigate("/instructor/create")}
            className="px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> New Course
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                thumbnail={course.thumbnail}
                rating={course.rating}
                students={course.students}
                lessons={course.lessons?.length || 0}
                onAction={() => navigate(`/instructor/course/${course.id}`)}
                actionLabel="Edit Course"
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No courses published yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              You haven't created any courses yet. Start sharing your knowledge with the world.
            </p>
            <button
              onClick={() => navigate("/instructor/create")}
              className="px-8 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md"
            >
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

