// Test script to upload video1.mp4 to Cloudinary
const testVideoUpload = async () => {
  try {
    // Read the video file
    const response = await fetch('/video1.mp4');
    const blob = await response.blob();
    const file = new File([blob], 'video1.mp4', { type: 'video/mp4' });

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lms_uploads");
    formData.append("folder", "videos");
    formData.append("public_id", `test_video_${Date.now()}`);
    formData.append("resource_type", "video");

    console.log('Uploading video to Cloudinary...');
    
    // Upload to Cloudinary
    const uploadResponse = await fetch(
      'https://api.cloudinary.com/v1_1/drj7eidzs/video/upload',
      { method: "POST", body: formData }
    );

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    console.log('Upload successful!');
    console.log('Video URL:', data.secure_url);
    
    return data.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Export for use in components
window.testVideoUpload = testVideoUpload;

console.log('Test video upload function loaded. Call testVideoUpload() to test.');