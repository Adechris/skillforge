const CLOUD_NAME = "drj7eidzs";
const UPLOAD_PRESET = "lms_uploads";

export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "avatars");
    formData.append("public_id", userId);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Image upload failed");
    }

    const data = await response.json();
    return data.secure_url;
};

export const uploadCourseImage = async (courseId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "courses");
    formData.append("public_id", courseId);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Image upload failed");
    }

    const data = await response.json();
    return data.secure_url;
};

export const uploadVideo = async (lessonId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "videos");
    formData.append("public_id", lessonId);
    formData.append("resource_type", "video");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Video upload failed");
    }

    const data = await response.json();
    return data.secure_url;
};
