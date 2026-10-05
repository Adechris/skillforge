import { motion } from "framer-motion";
import { Star, Clock, Loader2 } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor?: string;
  thumbnail: string;
  progress?: number;
  rating?: number;
  students?: number;
  lessons?: number;
  onAction?: () => void;
  actionLabel?: string;
}

const CourseCard = ({
  title,
  instructor,
  thumbnail,
  progress,
  rating,
  students,
  lessons,
  onAction,
  actionLabel = "Continue",
}: CourseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
  >
    <div className="relative h-40 overflow-hidden">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div className="h-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{title}</h3>
      {instructor && <p className="text-xs text-muted-foreground mb-3">{instructor}</p>}

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        {rating && (
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            {rating}
          </span>
        )}
        {students !== undefined && <span>{students.toLocaleString()} students</span>}
        {lessons !== undefined && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lessons} lessons
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          disabled={actionLabel?.includes("...")}
          className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {actionLabel?.includes("...") && <Loader2 className="w-4 h-4 animate-spin" />}
          {actionLabel}
        </button>
      )}
    </div>
  </motion.div>
);

export default CourseCard;
