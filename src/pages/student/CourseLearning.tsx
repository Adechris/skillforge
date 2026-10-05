import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Check, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function CourseLearning() {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        navigate("/student/courses");
        return;
      }
      try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);
        
        if (courseSnap.exists()) {
          const data = courseSnap.data();
          setCourse(data);
          setLessons(data.lessons || []);
        } else {
          toast.error("Course not found");
          navigate("/student/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No lessons available</h2>
          <button onClick={() => navigate("/student/courses")} className="text-primary hover:underline">
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentLesson + 1) / lessons.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-card">
        <button onClick={() => navigate("/student/courses")} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold text-foreground truncate flex-1">{course?.title || "Course"}</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-foreground">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: `${progress}%` }} />
          </div>
          {progress}% complete
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="relative bg-foreground/95 aspect-video w-full flex items-center justify-center">
            {lessons[currentLesson]?.type === "video" && lessons[currentLesson]?.videoUrl ? (
              <video 
                controls 
                className="w-full h-full"
                src={lessons[currentLesson].videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-primary/30 transition-colors">
                  <Play className="w-7 h-7 text-primary-foreground ml-1" />
                </div>
                <p className="text-primary-foreground/70 text-sm">{lessons[currentLesson]?.title}</p>
                <p className="text-primary-foreground/40 text-xs mt-1">Video not available</p>
              </div>
            )}
          </div>

          <div className="p-4 lg:p-6 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-1">{lessons[currentLesson].title}</h2>
            <p className="text-sm text-muted-foreground mb-4">Lesson {currentLesson + 1} of {lessons.length}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                disabled={currentLesson === lessons.length - 1}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 border-l border-border bg-card overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-sm">Course Content</h3>
            <p className="text-xs text-muted-foreground mt-1">{lessons.filter((l) => l.completed).length}/{lessons.length} completed</p>
          </div>
          <div className="divide-y divide-border">
            {lessons.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(i)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors ${i === currentLesson ? "bg-primary/5" : ""
                  }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${lesson.completed ? "bg-success text-success-foreground" : i === currentLesson ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                  {lesson.completed ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${i === currentLesson ? "font-medium text-foreground" : "text-foreground/80"}`}>{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Lesson Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-80 bg-card z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">Course Content</h3>
                  <button onClick={() => setSidebarOpen(false)} className="text-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="divide-y divide-border">
                  {lessons.map((lesson, i) => (
                    <button
                      key={lesson.id}
                      onClick={() => { setCurrentLesson(i); setSidebarOpen(false); }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 ${i === currentLesson ? "bg-primary/5" : ""}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${lesson.completed ? "bg-success text-success-foreground" : i === currentLesson ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                        {lesson.completed ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

