import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Globe, Lock, Camera, Loader2, Eye, EyeOff, Check, Shield, Mail } from "lucide-react";
import { updateUserProfile } from "@/lib/firestore";
import { uploadProfilePhoto } from "@/lib/storage";
import { toast } from "sonner";

export default function InstructorSettings() {
  const { user, refreshUser, changePassword } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Keep local state in sync when user data refreshes
  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.bio !== undefined) setBio(user.bio || "");
  }, [user?.name, user?.bio]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  // Notification preferences (persisted locally for now)
  const [notifEnrollments, setNotifEnrollments] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifAnalytics, setNotifAnalytics] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.id, { name, bio });
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile save error:", error);
      toast.error(error.code === "permission-denied"
        ? "Permission denied. Please update Firestore rules in the Firebase Console."
        : (error.message || "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadProfilePhoto(user.id, file);
      await updateUserProfile(user.id, { avatar: url });
      await refreshUser();
      toast.success("Profile photo updated!");
    } catch (error: any) {
      console.error("Photo upload error:", error);
      toast.error(error.code === "storage/unauthorized"
        ? "Storage permission denied. Please update Storage rules in the Firebase Console."
        : (error.message || "Failed to upload photo"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsChangingPw(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.message || "Failed to update password");
      }
    } finally {
      setIsChangingPw(false);
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Manage your preferences and account</p>
        </div>

        {/* Profile Section */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4" /> Profile
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || "I"}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">{user?.name || "Instructor"}</h4>
              <p className="text-sm text-muted-foreground capitalize">{user?.role || "Instructor"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
          {[
            { label: "Email notifications for new enrollments", checked: notifEnrollments, setter: setNotifEnrollments },
            { label: "Push notifications for messages", checked: notifMessages, setter: setNotifMessages },
            { label: "Weekly analytics summary", checked: notifAnalytics, setter: setNotifAnalytics },
          ].map((item, i) => (
            <label key={i} className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-foreground">{item.label}</span>
              <button
                type="button"
                onClick={() => item.setter(!item.checked)}
                className={`w-10 h-6 rounded-full relative transition-colors ${item.checked ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-card absolute top-1 transition-all ${item.checked ? "right-1" : "left-1"}`} />
              </button>
            </label>
          ))}
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Globe className="w-4 h-4" /> Preferences</h3>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Language</label>
            <select className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Timezone</label>
            <select className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all">
              <option>UTC-5 Eastern Time</option>
              <option>UTC-8 Pacific Time</option>
              <option>UTC+0 GMT</option>
              <option>UTC+1 WAT</option>
            </select>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Lock className="w-4 h-4" /> Security</h3>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={isChangingPw}
            className="px-6 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-all flex items-center gap-2"
          >
            {isChangingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {isChangingPw ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
