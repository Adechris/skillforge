import courseWebDev from "@/assets/course-web-dev.jpg";
import courseDataScience from "@/assets/course-data-science.jpg";
import courseUiDesign from "@/assets/course-ui-design.jpg";
import courseMobileDev from "@/assets/course-mobile-dev.jpg";
import courseMl from "@/assets/course-ml.jpg";
import courseMarketing from "@/assets/course-marketing.jpg";

export const instructorCourses = [
  { id: "1", title: "Complete Web Development Bootcamp", thumbnail: courseWebDev, students: 1234, rating: 4.8, lessons: 42, progress: undefined, price: "$49.99", published: true },
  { id: "2", title: "Data Science Fundamentals with Python", thumbnail: courseDataScience, students: 856, rating: 4.6, lessons: 38, progress: undefined, price: "$39.99", published: true },
  { id: "3", title: "UI/UX Design Masterclass", thumbnail: courseUiDesign, students: 2100, rating: 4.9, lessons: 28, progress: undefined, price: "$59.99", published: true },
  { id: "4", title: "Mobile App Development with React Native", thumbnail: courseMobileDev, students: 654, rating: 4.7, lessons: 35, progress: undefined, price: "$44.99", published: false },
];

export const studentCourses = [
  { id: "1", title: "Complete Web Development Bootcamp", instructor: "Dr. Sarah Mitchell", thumbnail: courseWebDev, progress: 72, rating: 4.8, lessons: 42, students: 1234 },
  { id: "2", title: "Data Science Fundamentals with Python", instructor: "Prof. James Chen", thumbnail: courseDataScience, progress: 45, rating: 4.6, lessons: 38, students: 856 },
  { id: "3", title: "UI/UX Design Masterclass", instructor: "Emma Rodriguez", thumbnail: courseUiDesign, progress: 90, rating: 4.9, lessons: 28, students: 2100 },
];

export const browseCourses = [
  { id: "5", title: "Machine Learning A-Z", instructor: "Dr. Andrew Ng", thumbnail: courseMl, rating: 4.9, lessons: 55, students: 5420, price: "$69.99" },
  { id: "6", title: "Digital Marketing Strategy", instructor: "Lisa Park", thumbnail: courseMarketing, rating: 4.5, lessons: 22, students: 3100, price: "$29.99" },
  { id: "1", title: "Complete Web Development Bootcamp", instructor: "Dr. Sarah Mitchell", thumbnail: courseWebDev, rating: 4.8, lessons: 42, students: 1234, price: "$49.99" },
  { id: "2", title: "Data Science Fundamentals", instructor: "Prof. James Chen", thumbnail: courseDataScience, rating: 4.6, lessons: 38, students: 856, price: "$39.99" },
  { id: "3", title: "UI/UX Design Masterclass", instructor: "Emma Rodriguez", thumbnail: courseUiDesign, rating: 4.9, lessons: 28, students: 2100, price: "$59.99" },
  { id: "4", title: "React Native Mobile Dev", instructor: "Tom Hardy", thumbnail: courseMobileDev, rating: 4.7, lessons: 35, students: 654, price: "$44.99" },
];

export const studentsData = [
  { id: "1", name: "Alex Johnson", email: "alex@example.com", course: "Web Development", progress: 72, enrolled: "Jan 15, 2026" },
  { id: "2", name: "Maria Garcia", email: "maria@example.com", course: "Data Science", progress: 45, enrolled: "Feb 3, 2026" },
  { id: "3", name: "John Smith", email: "john@example.com", course: "UI/UX Design", progress: 90, enrolled: "Dec 20, 2025" },
  { id: "4", name: "Sarah Williams", email: "sarah@example.com", course: "Web Development", progress: 30, enrolled: "Feb 18, 2026" },
  { id: "5", name: "David Lee", email: "david@example.com", course: "Data Science", progress: 60, enrolled: "Jan 28, 2026" },
  { id: "6", name: "Emily Brown", email: "emily@example.com", course: "UI/UX Design", progress: 85, enrolled: "Jan 5, 2026" },
];
