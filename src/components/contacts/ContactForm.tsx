import { Loader2, User as UserIcon, MapPin, Building2, Tag, UserCircle } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Contact, ContactFormData } from "@/lib/types/contact";
import type { Organization } from "@/lib/types/organization";
import type { User } from "@/lib/types/user";
import {
  LEAD_STATUS_OPTIONS,
  LIFECYCLE_STAGE_OPTIONS,
  CONTACT_SOURCE_OPTIONS,
} from "@/lib/types/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const contactSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First name is required")
    .max(255, "First name must be less than 255 characters"),
  last_name: Yup.string()
    .required("Last name is required")
    .max(255, "Last name must be less than 255 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().max(50, "Phone must be less than 50 characters"),
  job_title: Yup.string().max(255, "Job title must be less than 255 characters"),
  company_name: Yup.string().max(255, "Company name must be less than 255 characters"),
  organization: Yup.number().required("Organization is required"),
});

interface ContactFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ContactFormData) => Promise<void>;
  contact?: Contact | null;
  organizations: Organization[];
  users: User[];
  submitting: boolean;
}

export function ContactForm({
  isOpen,
  onOpenChange,
  onSubmit,
  contact,
  organizations,
  users,
  submitting,
}: ContactFormProps) {
  const isEditMode = !!contact;

  const formik = useFormik<ContactFormData>({
    initialValues: {
      first_name: contact?.first_name || "",
      last_name: contact?.last_name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      job_title: contact?.job_title || "",
      company_name: contact?.company_name || "",
      address_line_1: contact?.address_line_1 || "",
      address_line_2: contact?.address_line_2 || "",
      city: contact?.city || "",
      state: contact?.state || "",
      country: contact?.country || "",
      postal_code: contact?.postal_code || "",
      source: contact?.source || "",
      lead_status: contact?.lead_status || "",
      lifecycle_stage: contact?.lifecycle_stage || "",
      tags: contact?.tags || [],
      owner: contact?.owner || null,
      is_active: contact?.is_active ?? true,
      description: contact?.description || "",
      organization: contact?.organization || organizations[0]?.id || 0,
    },
    validationSchema: contactSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
      formik.resetForm();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Edit Contact" : "Create New Contact"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update contact information below"
              : "Fill in the details to add a new contact to your CRM"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.first_name &&
                        formik.errors.first_name &&
                        "border-red-500"
                    )}
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <p className="text-sm text-red-500">
                      {formik.errors.first_name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.last_name &&
                        formik.errors.last_name &&
                        "border-red-500"
                    )}
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <p className="text-sm text-red-500">
                      {formik.errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    formik.touched.email &&
                      formik.errors.email &&
                      "border-red-500"
                  )}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    placeholder="Marketing Manager"
                    value={formik.values.job_title}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  placeholder="Acme Corporation"
                  value={formik.values.company_name}
                  onChange={formik.handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_line_1">Address Line 1</Label>
                <Input
                  id="address_line_1"
                  name="address_line_1"
                  placeholder="123 Main Street"
                  value={formik.values.address_line_1}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line_2"
                  name="address_line_2"
                  placeholder="Suite 100, Apartment 4B"
                  value={formik.values.address_line_2}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="NY"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    placeholder="10001"
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="United States"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* CRM Details Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                CRM Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <select
                    id="source"
                    name="source"
                    value={formik.values.source || ""}
                    onChange={formik.handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select source</option>
                    {CONTACT_SOURCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead_status">Lead Status</Label>
                  <select
                    id="lead_status"
                    name="lead_status"
                    value={formik.values.lead_status || ""}
                    onChange={formik.handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select status</option>
                    {LEAD_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lifecycle_stage">Lifecycle Stage</Label>
                  <select
                    id="lifecycle_stage"
                    name="lifecycle_stage"
                    value={formik.values.lifecycle_stage || ""}
                    onChange={formik.handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select stage</option>
                    {LIFECYCLE_STAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add any additional notes or information about this contact..."
                  value={formik.values.description || ""}
                  onChange={formik.handleChange}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ownership & Organization Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Ownership & Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">
                    Organization <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="organization"
                    name="organization"
                    value={formik.values.organization}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      formik.touched.organization &&
                        formik.errors.organization &&
                        "border-red-500"
                    )}
                  >
                    {organizations.length === 0 && (
                      <option value="">No organizations available</option>
                    )}
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.organization && formik.errors.organization && (
                    <p className="text-sm text-red-500">
                      {formik.errors.organization}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Assigned Owner</Label>
                  <select
                    id="owner"
                    name="owner"
                    value={formik.values.owner || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "owner",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border bg-muted/30">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formik.values.is_active}
                  onChange={formik.handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                />
                <Label htmlFor="is_active" className="cursor-pointer font-normal">
                  Contact is active
                </Label>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditMode ? "Update" : "Create"} Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

