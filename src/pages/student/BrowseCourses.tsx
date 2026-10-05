import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import CourseCard from "@/components/CourseCard";
import { browseCourses as mockCourses } from "@/data/mockData";
import { LayoutDashboard, BookOpen, Compass, TrendingUp, MessageSquare, User, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCourses, enrollInCourse } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


const categories = ["All", "Web Development", "Data Science", "Design", "Mobile", "Marketing", "AI/ML"];

export default function BrowseCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (course: any) => {
    if (!user) return;
    
    setEnrolling(course.id);
    try {
      await enrollInCourse(user.id, course.id, course.instructorId, course);
      toast.success(`Successfully enrolled in ${course.title}!`);
      navigate("/student/courses");
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course");
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) && (activeCategory === "All" || c.category === activeCategory)
  );

  return (
    <DashboardLayout title="Browse Courses">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Browse Courses</h2>
          <p className="text-muted-foreground">Discover new skills to learn</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                instructor={course.instructorName}
                thumbnail={course.thumbnail}
                rating={course.rating}
                students={course.students}
                lessons={course.lessons?.length || 0}
                onAction={() => handleEnroll(course)}
                actionLabel={enrolling === course.id ? "Enrolling..." : "Enroll Now"}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-dashed border-border p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {search || activeCategory !== "All"
                ? "No courses match your search or filter criteria."
                : "There are currently no courses available."}
            </p>
            {(search || activeCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

