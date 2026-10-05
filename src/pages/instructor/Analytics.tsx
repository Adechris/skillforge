import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getInstructorCourses, getInstructorEnrollments } from "@/lib/firestore";
import { LayoutDashboard, BookOpen, PlusCircle, Users, BarChart3, MessageSquare, Settings, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";


export default function InstructorAnalytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

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
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Derive simple charts from actual data
  const courseCategories = courses.reduce((acc: any, course) => {
    const cat = course.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(courseCategories).map((name, i) => ({
    name,
    value: courseCategories[name],
    color: [`#1a7a8a`, `#e09200`, `#2d9e5e`, `#3366cc`][i % 4]
  }));

  const totalRevenue = courses.reduce((sum, c) => sum + (Number(c.price) || 0) * (c.students || 0), 0);

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground">Track your course performance</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h3 className="text-base font-semibold text-foreground mb-4">Course Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Total Students</p>
                  <p className="text-xl font-bold text-foreground">{enrollments.length}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-xl font-bold text-foreground">${totalRevenue}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h3 className="text-base font-semibold text-foreground mb-4">Course Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                {pieData.length > 0 ? (
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {pieData.map((entry: any, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No course data available</div>
                )}
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {pieData.map((item: any, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-card lg:col-span-2">
              <h3 className="text-base font-semibold text-foreground mb-4">My Courses Performance</h3>
              <div className="space-y-4">
                {courses.length > 0 ? (
                  courses.map((course: any, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-medium">{course.title}</span>
                        <span className="text-muted-foreground">{course.students || 0} students</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, (course.students || 0) / 10)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No courses yet to track</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
