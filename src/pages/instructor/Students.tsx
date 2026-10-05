import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getInstructorEnrollments, getAllUsers } from "@/lib/firestore";
import { LayoutDashboard, BookOpen, PlusCircle, Users, BarChart3, MessageSquare, Settings, Loader2 } from "lucide-react";


export default function InstructorStudents() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [enrollmentData, userData] = await Promise.all([
          getInstructorEnrollments(user.id),
          getAllUsers()
        ]);

        // Map enrollments to user data to get names/emails
        const mappedEnrollments = enrollmentData.map((enrollment: any) => {
          const student = userData.find((u: any) => u.id === enrollment.studentId) as any;
          return {
            ...enrollment,
            studentName: student?.name || "Unknown Student",
            studentEmail: student?.email || "No Email"
          };
        });

        setEnrollments(mappedEnrollments);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <DashboardLayout title="Students">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground">View and manage enrolled students</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : enrollments.length > 0 ? (
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {s.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.studentName}</p>
                            <p className="text-xs text-muted-foreground">{s.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{s.courseTitle}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full gradient-primary rounded-full" style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium text-foreground">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {s.enrolledAt?.toDate?.() ? s.enrolledAt.toDate().toLocaleDateString() : "New"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No students yet</h4>
            <p className="text-muted-foreground">Once students enroll in your courses, they will appear here.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
