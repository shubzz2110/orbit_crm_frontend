import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Building2, Save, Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/services/axios";
import type { Organization } from "@/lib/types/organization";
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

const organizationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Organization name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 255 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    )
    .min(2, "Slug must be at least 2 characters")
    .max(255, "Slug must be less than 255 characters"),
  description: Yup.string().max(
    1000,
    "Description must be less than 1000 characters"
  ),
  visible: Yup.boolean(),
});

export default function Organization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik<{
    name: string;
    slug: string;
    description: string;
    visible: boolean;
  }>({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      visible: true,
    },
    validationSchema: organizationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const response = await api.patch<Organization>(
          "/accounts/my-organization/",
          values
        );
        setOrganization(response.data);
        toast.success("Organization updated successfully");
      } catch (error: unknown) {
        const err = error as {
          response?: {
            data?:
              | { message?: string; error?: string; detail?: string }
              | string;
          };
          message?: string;
        };

        let errorMessage = "Failed to update organization";

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else {
            errorMessage =
              err.response.data.message ||
              err.response.data.error ||
              err.response.data.detail ||
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

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const response = await api.get<Organization>(
          "/accounts/my-organization/"
        );
        setOrganization(response.data);
        formik.setValues({
          name: response.data.name,
          slug: response.data.slug,
          description: response.data.description || "",
          visible: response.data.visible,
        });
      } catch (error: unknown) {
        const err = error as {
          response?: { status?: number };
          message?: string;
        };
        if (err.response?.status === 404) {
          toast.error("No organization found", {
            description: "You are not associated with any organization.",
          });
        } else {
          toast.error("Failed to load organization", {
            description:
              err.message || "An error occurred while fetching organization",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!organization) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Organization Found</h3>
          <p className="text-muted-foreground text-center">
            You are not associated with any organization.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization details and settings
        </p>
      </div>

      {/* Organization Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>@{organization.slug}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Organization name"
                className={cn(
                  formik.touched.name &&
                    formik.errors.name &&
                    "border-destructive"
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="organization-slug"
                className={cn(
                  formik.touched.slug &&
                    formik.errors.slug &&
                    "border-destructive"
                )}
              />
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm text-destructive">{formik.errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                The slug is used in URLs and must be unique. Use lowercase
                letters, numbers, and hyphens only.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Organization description"
                rows={4}
                className={cn(
                  "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  formik.touched.description &&
                    formik.errors.description &&
                    "border-destructive"
                )}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-destructive">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 p-4 rounded-lg border bg-muted/50">
              <input
                type="checkbox"
                id="visible"
                name="visible"
                checked={formik.values.visible}
                onChange={formik.handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div className="flex-1">
                <Label
                  htmlFor="visible"
                  className="cursor-pointer flex items-center gap-2"
                >
                  {formik.values.visible ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Make organization visible</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  When visible, the organization will be shown in public
                  listings and searches.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={submitting || !formik.dirty}
                className="w-full sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              {formik.dirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    formik.resetForm();
                    if (organization) {
                      formik.setValues({
                        name: organization.name,
                        slug: organization.slug,
                        description: organization.description || "",
                        visible: organization.visible,
                      });
                    }
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Organization Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Additional details about your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created
              </p>
              <p className="text-sm mt-1">
                {new Date(organization.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Updated
              </p>
              <p className="text-sm mt-1">
                {new Date(organization.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {organization.user_count !== undefined && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-sm mt-1">{organization.user_count}</p>
              </div>
            )}
            {organization.role_count !== undefined && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Roles
                </p>
                <p className="text-sm mt-1">{organization.role_count}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
