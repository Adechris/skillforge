import DashboardLayout from "@/components/DashboardLayout";
import DashboardCard from "@/components/DashboardCard";
import CourseCard from "@/components/CourseCard";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, PlusCircle, Users, BarChart3,
  MessageSquare, Settings, DollarSign, TrendingUp, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getInstructorCourses, getInstructorEnrollments } from "@/lib/firestore";


export default function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [courseData, enrollmentData] = await Promise.all([
          getInstructorCourses(user.id),
          getInstructorEnrollments(user.id)
        ]);
        setCourses(courseData);
        setEnrollments(enrollmentData);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalEarnings = courses.reduce((sum, c) => sum + (Number(c.price) || 0) * (c.students || 0), 0);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "Instructor"} 👋
          </h2>
          <p className="text-muted-foreground">Here's what's happening with your courses today.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard title="Total Courses" value={courses.length} icon={<BookOpen className="w-5 h-5" />} color="primary" trend={courses.length > 0 ? "" : "Start creating!"} />
              <DashboardCard title="Total Students" value={enrollments.length} icon={<Users className="w-5 h-5" />} color="info" trend="" />
              <DashboardCard title="Total Earnings" value={`$${totalEarnings}`} icon={<DollarSign className="w-5 h-5" />} color="success" trend="" />
              <DashboardCard title="Engagement Rate" value="0%" icon={<TrendingUp className="w-5 h-5" />} color="accent" trend="" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recently Published</h3>
                <button onClick={() => navigate("/instructor/courses")} className="text-sm text-primary hover:underline">
                  View all
                </button>
              </div>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.slice(0, 3).map((course) => (
                    <CourseCard
                      key={course.id}
                      title={course.title}
                      thumbnail={course.thumbnail}
                      rating={course.rating}
                      students={course.students || 0}
                      lessons={course.lessons?.length || 0}
                      onAction={() => navigate("/instructor/courses")}
                      actionLabel="Manage"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <PlusCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">No courses yet</h4>
                  <p className="text-muted-foreground mb-6">Create your first course to start teaching.</p>
                  <button
                    onClick={() => navigate("/instructor/create")}
                    className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Create Course
                  </button>
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {courses.length > 0 ? (
                  [
                    { text: "Dashboard synchronized with Firestore", time: "Just now" },
                    { text: `${courses.length} courses loaded`, time: "Just now" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <p className="text-sm text-foreground">{item.text}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

