import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, Compass, TrendingUp, MessageSquare, User, Award, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentEnrollments } from "@/lib/firestore";


export default function StudentProgress() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const data = await getStudentEnrollments(user.id);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length)
    : 0;

  return (
    <DashboardLayout title="Progress">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Progress</h2>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(totalProgress / 100) * 213.6} 213.6`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">{totalProgress}%</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
                  <p className="text-sm text-muted-foreground">{courses.length} courses in progress</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="bg-card rounded-2xl border border-border p-5 shadow-card">
                    <div className="flex items-start gap-4">
                      <img src={course.courseThumbnail || course.thumbnail} alt={course.courseTitle || course.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm mb-1">{course.courseTitle || course.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{course.instructorName || course.instructor}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{course.progress}%</span>
                        </div>
                        {course.progress === 100 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-success">
                            <Award className="w-3.5 h-3.5" /> Certificate earned
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">No progress tracked yet. Enroll in a course to start learning!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

