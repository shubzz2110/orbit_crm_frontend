import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  User,
  Mail,
  Loader2,
  Save,
  Lock,
  Globe,
  Languages,
  Camera,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Upload,
  X,
} from "lucide-react";
import { userService } from "@/services/userService";
import type { UserProfileUpdateData } from "@/services/userService";
import type { User as UserType } from "@/lib/types/user";
import api from "@/services/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const profileSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  timezone: Yup.string().max(50, "Timezone must be less than 50 characters"),
  language: Yup.string().max(10, "Language must be less than 10 characters"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  password_confirm: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
});

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<UserProfileUpdateData & { password_confirm?: string }>({
    initialValues: {
      full_name: "",
      timezone: "UTC",
      language: "en",
      password: "",
      password_confirm: "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const updateData: UserProfileUpdateData = {
          full_name: values.full_name,
          timezone: values.timezone,
          language: values.language,
        };

        if (changePassword && values.password) {
          updateData.password = values.password;
          updateData.password_confirm = values.password_confirm;
        }

        const updatedUser = await userService.updateProfile(updateData);
        setUser(updatedUser);
        toast.success("Profile updated successfully", {
          description: "Your profile has been updated.",
        });
        setChangePassword(false);
        formik.setFieldValue("password", "");
        formik.setFieldValue("password_confirm", "");
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?:
              | {
                  message?: string;
                  error?: string;
                  detail?: string;
                  password?: string[];
                }
              | string;
          };
          message?: string;
        };

        let errorMessage = "Failed to update profile";

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else {
            errorMessage =
              err.response.data.message ||
              err.response.data.error ||
              err.response.data.detail ||
              (Array.isArray(err.response.data.password)
                ? err.response.data.password[0]
                : null) ||
              errorMessage;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setUser(userData);
      formik.setValues({
        full_name: userData.full_name || "",
        timezone: (userData as any).timezone || "UTC",
        language: (userData as any).language || "en",
        password: "",
        password_confirm: "",
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to load profile", {
        description: err.message || "An error occurred while fetching your profile",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    handleUploadPicture(file);
  };

  const handleUploadPicture = async (file: File) => {
    try {
      setUploadingPicture(true);
      const updatedUser = await userService.uploadProfilePicture(file);
      setUser(updatedUser);
      setPreviewImage(null);
      toast.success("Profile picture updated", {
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?:
            | {
                message?: string;
                error?: string;
                detail?: string;
                profile_picture?: string[];
              }
            | string;
        };
        message?: string;
      };

      let errorMessage = "Failed to upload profile picture";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else {
          errorMessage =
            err.response.data.message ||
            err.response.data.error ||
            err.response.data.detail ||
            (Array.isArray(err.response.data.profile_picture)
              ? err.response.data.profile_picture[0]
              : null) ||
            errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error("Upload failed", {
        description: errorMessage,
      });
      setPreviewImage(null);
    } finally {
      setUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePicture = async () => {
    try {
      setUploadingPicture(true);
      // Send null to remove the picture (Django will handle this)
      const formData = new FormData();
      formData.append("profile_picture", "");
      const response = await api.patch<UserType>("/accounts/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data);
      setPreviewImage(null);
      toast.success("Profile picture removed", {
        description: "Your profile picture has been removed.",
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error("Failed to remove picture", {
        description: err.message || "An error occurred",
      });
    } finally {
      setUploadingPicture(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 flex items-center justify-center overflow-hidden ring-2 ring-border transition-all">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.full_name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                  {uploadingPicture && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full z-10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                  {/* Hover overlay with buttons */}
                  <div className="absolute inset-0 bg-black/60 dark:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-10">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={uploadingPicture}
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-background/90 hover:bg-background text-foreground shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPicture}
                      title="Change profile picture"
                    >
                      {uploadingPicture ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    {user?.profile_picture && !uploadingPicture && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-background/90 hover:bg-destructive hover:text-destructive-foreground text-foreground shadow-lg"
                        onClick={handleRemovePicture}
                        disabled={uploadingPicture}
                        title="Remove profile picture"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{user?.full_name}</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </p>
              </div>
              <div className="w-full pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  {user?.is_active ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <XCircle className="h-4 w-4" />
                      Inactive
                    </span>
                  )}
                </div>
                {user?.organization_name && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Organization</span>
                    <span className="font-medium">{user.organization_name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="John Doe"
                        className={cn(
                          formik.touched.full_name &&
                            formik.errors.full_name &&
                            "border-red-500"
                        )}
                      />
                      {formik.touched.full_name && formik.errors.full_name && (
                        <p className="text-sm text-error">{formik.errors.full_name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Timezone
                        </Label>
                        <Input
                          id="timezone"
                          name="timezone"
                          value={formik.values.timezone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="UTC"
                        />
                        {formik.touched.timezone && formik.errors.timezone && (
                          <p className="text-sm text-error">{formik.errors.timezone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language" className="flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Language
                        </Label>
                        <Input
                          id="language"
                          name="language"
                          value={formik.values.language}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="en"
                        />
                        {formik.touched.language && formik.errors.language && (
                          <p className="text-sm text-error">{formik.errors.language}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Password Change */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Change your password to keep your account secure
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChangePassword(!changePassword);
                        if (changePassword) {
                          formik.setFieldValue("password", "");
                          formik.setFieldValue("password_confirm", "");
                        }
                      }}
                    >
                      {changePassword ? "Cancel" : "Change Password"}
                    </Button>
                  </div>

                  {changePassword && (
                    <div className="space-y-4 p-4 rounded-lg border bg-muted/50">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter new password"
                            className={cn(
                              formik.touched.password &&
                                formik.errors.password &&
                                "border-red-500"
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                          <p className="text-sm text-error">{formik.errors.password}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Must be at least 8 characters with uppercase, lowercase, and number
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password_confirm">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="password_confirm"
                            name="password_confirm"
                            type={showPasswordConfirm ? "text" : "password"}
                            value={formik.values.password_confirm}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Confirm new password"
                            className={cn(
                              formik.touched.password_confirm &&
                                formik.errors.password_confirm &&
                                "border-red-500"
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                          >
                            {showPasswordConfirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {formik.touched.password_confirm &&
                          formik.errors.password_confirm && (
                            <p className="text-sm text-error">
                              {formik.errors.password_confirm}
                            </p>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setChangePassword(false);
                    formik.resetForm();
                    if (user) {
                      formik.setValues({
                        full_name: user.full_name || "",
                        timezone: (user as any).timezone || "UTC",
                        language: (user as any).language || "en",
                        password: "",
                        password_confirm: "",
                      });
                    }
                  }}
                  disabled={submitting}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

