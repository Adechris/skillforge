import { useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, BookOpen, PlusCircle, Users, BarChart3, MessageSquare, Settings, Upload, Plus, Trash2, Loader2, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createCourse } from "@/lib/firestore";
import { uploadCourseImage, uploadVideo } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export default function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [lessons, setLessons] = useState([{ title: "", type: "video", videoUrl: "" }]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    
    setUploadingThumbnail(true);
    try {
      const courseId = `course_${Date.now()}`;
      const url = await uploadCourseImage(courseId, file);
      setThumbnail(url);
      toast.success("Thumbnail uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoUpload = async (file: File, lessonIndex: number) => {
    if (!file) return;
    
    setUploadingVideo(lessonIndex);
    try {
      const lessonId = `lesson_${Date.now()}_${lessonIndex}`;
      const url = await uploadVideo(lessonId, file);
      const newLessons = [...lessons];
      newLessons[lessonIndex].videoUrl = url;
      setLessons(newLessons);
      toast.success("Video uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploadingVideo(null);
    }
  };

  const handlePublish = async () => {
    if (!user) return;
    if (!title || !description) {
      toast.error("Please fill in the title and description");
      return;
    }

    setIsPublishing(true);
    try {
      await createCourse({
        title,
        description,
        price,
        category,
        lessons,
        instructorId: user.id,
        instructorName: user.name,
        students: 0,
        rating: 0,
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
      });
      toast.success("Course published successfully!");
      navigate("/instructor/courses");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish course");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <DashboardLayout title="Create Course">
      <div className="  space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create New Course</h2>
          <p className="text-muted-foreground">Fill in the details to publish your course</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete React Masterclass"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students will learn..."
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Course Thumbnail</label>
            <div 
              onClick={() => thumbnailInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              {uploadingThumbnail ? (
                <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
              ) : thumbnail ? (
                <div className="space-y-2">
                  <img src={thumbnail} alt="Thumbnail" className="w-20 h-20 object-cover rounded-lg mx-auto" />
                  <p className="text-sm text-green-600">Thumbnail uploaded</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$49.99"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              >
                <option>Web Development</option>
                <option>Data Science</option>
                <option>Design</option>
                <option>Mobile Development</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Lessons</h3>
            <button
              onClick={() => {
                setLessons([...lessons, { title: "", type: "video", videoUrl: "" }]);
                // Extend the refs array
                videoInputRefs.current = [...videoInputRefs.current, null];
              }}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
          </div>
          {lessons.map((lesson, i) => (
            <div key={i} className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-xs font-medium text-muted-foreground mt-3 w-6">{i + 1}.</span>
                <input
                  type="text"
                  value={lesson.title}
                  onChange={(e) => {
                    const newLessons = [...lessons];
                    newLessons[i].title = e.target.value;
                    setLessons(newLessons);
                  }}
                  placeholder={`Lesson ${i + 1} title`}
                  className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <select
                  value={lesson.type}
                  onChange={(e) => {
                    const newLessons = [...lessons];
                    newLessons[i].type = e.target.value;
                    setLessons(newLessons);
                  }}
                  className="px-3 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                  <option value="quiz">Quiz</option>
                </select>
                {lessons.length > 1 && (
                  <button
                    onClick={() => setLessons(lessons.filter((_, j) => j !== i))}
                    className="mt-3 text-destructive hover:opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {lesson.type === "video" && (
                <div className="ml-9">
                  <div 
                    onClick={() => videoInputRefs.current[i]?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    {uploadingVideo === i ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Uploading video...</span>
                      </div>
                    ) : lesson.videoUrl ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Video className="w-5 h-5" />
                        <span className="text-sm">Video uploaded</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload video</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={(el) => videoInputRefs.current[i] = el}
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0], i)}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Course"}
        </button>
      </div>
    </DashboardLayout>
  );
};

