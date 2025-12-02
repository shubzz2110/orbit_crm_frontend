import { Loader2, User as UserIcon, MapPin, Building2, Tag, Globe } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Lead, LeadFormData } from "@/lib/types/lead";
import type { Organization } from "@/lib/types/organization";
import type { User } from "@/lib/types/user";
import { LEAD_SOURCE_OPTIONS } from "@/lib/types/lead";
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

const leadSchema = Yup.object().shape({
  lead_name: Yup.string()
    .required("Lead name is required")
    .max(255, "Lead name must be less than 255 characters"),
  organization: Yup.number().required("Organization is required"),
  email: Yup.string()
    .email("Invalid email address")
    .nullable()
    .test(
      "email-or-phone",
      "Either email or phone is required",
      function (value) {
        const { phone } = this.parent;
        return !!(value || phone);
      }
    ),
  phone: Yup.string()
    .nullable()
    .test(
      "email-or-phone",
      "Either email or phone is required",
      function (value) {
        const { email } = this.parent;
        return !!(value || email);
      }
    ),
});

interface LeadFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LeadFormData) => Promise<void>;
  lead?: Lead | null;
  organizations: Organization[];
  users: User[];
  submitting: boolean;
}

export function LeadForm({
  isOpen,
  onOpenChange,
  onSubmit,
  lead,
  organizations,
  users,
  submitting,
}: LeadFormProps) {
  const isEditMode = !!lead;

  const formik = useFormik<LeadFormData>({
    initialValues: {
      lead_name: lead?.lead_name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      company_name: lead?.company_name || "",
      address_line1: lead?.address_line1 || "",
      address_line2: lead?.address_line2 || "",
      city: lead?.city || "",
      state: lead?.state || "",
      country: lead?.country || "",
      postal_code: lead?.postal_code || "",
      source: lead?.source || "",
      utm_source: lead?.utm_source || "",
      utm_campaign: lead?.utm_campaign || "",
      website_url: lead?.website_url || "",
      tags: lead?.tags || [],
      notes: lead?.notes || "",
      assigned_to: lead?.assigned_to || null,
      organization: lead?.organization || organizations[0]?.id || 0,
    },
    validationSchema: leadSchema,
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
            {isEditMode ? "Edit Lead" : "Create New Lead"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update lead information below"
              : "Fill in the details to add a new lead to your CRM"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lead_name">
                  Lead Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lead_name"
                  name="lead_name"
                  placeholder="Company name or lead name"
                  value={formik.values.lead_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    formik.touched.lead_name && formik.errors.lead_name && "border-red-500"
                  )}
                />
                {formik.touched.lead_name && formik.errors.lead_name && (
                  <p className="text-sm text-red-500">{formik.errors.lead_name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email {!formik.values.phone && <span className="text-red-500">*</span>}
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
                      formik.touched.email && formik.errors.email && "border-red-500"
                    )}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone {!formik.values.email && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      formik.touched.phone && formik.errors.phone && "border-red-500"
                    )}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500">{formik.errors.phone}</p>
                  )}
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

          {/* Address Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  placeholder="123 Main Street"
                  value={formik.values.address_line1}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  placeholder="Suite 100"
                  value={formik.values.address_line2}
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

          {/* Source & Marketing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Source & Marketing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <select
                  id="source"
                  name="source"
                  value={formik.values.source || ""}
                  onChange={formik.handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select source</option>
                  {LEAD_SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="utm_source">UTM Source</Label>
                  <Input
                    id="utm_source"
                    name="utm_source"
                    placeholder="google"
                    value={formik.values.utm_source}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utm_campaign">UTM Campaign</Label>
                  <Input
                    id="utm_campaign"
                    name="utm_campaign"
                    placeholder="summer-sale"
                    value={formik.values.utm_campaign}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  placeholder="https://example.com"
                  value={formik.values.website_url}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any additional notes..."
                  value={formik.values.notes || ""}
                  onChange={formik.handleChange}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ownership & Organization */}
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
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      formik.touched.organization &&
                        formik.errors.organization &&
                        "border-red-500"
                    )}
                  >
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
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <select
                    id="assigned_to"
                    name="assigned_to"
                    value={formik.values.assigned_to || ""}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "assigned_to",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              {isEditMode ? "Update" : "Create"} Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

