"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  contactNumber: string;
  officeAddress: string;
  receiveEmailUpdates: boolean;
  receiveSystemAlerts: boolean;
  profilePicture: string;
};

const initialForm: ProfileForm = {
  firstName: "System",
  lastName: "Administrator",
  email: "admin@starita.gov.ph",
  role: "Administrator",
  contactNumber: "",
  officeAddress: "Municipal Hall, Sta. Rita, Samar",
  receiveEmailUpdates: true,
  receiveSystemAlerts: true,
  profilePicture: "",
};

export default function UserProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", { description: "Please select an image file." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateField("profilePicture", ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const updateField = <K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success("Profile updated", {
      description: "Your profile preferences were saved.",
    });
  };

  const handleReset = () => {
    setForm(initialForm);
    toast.message("Changes reverted", {
      description: "Profile fields were reset to default values.",
    });
  };

  return (
    <div className="flex w-full overflow-x-hidden">
      <main className="flex-1 w-full">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/user")}
            className="font-lexend mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Management
        </button>

          <h1 className="text-2xl font-bold text-[#595a5d]">My Profile</h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage your account details and notification preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border bg-white p-5 xl:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative shrink-0">
                {form.profilePicture ? (
                  <img
                    src={form.profilePicture}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-200"
                  />
                ) : (
                  <UserCircle2 className="h-16 w-16 text-slate-400" />
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white shadow transition hover:bg-slate-900"
                  title="Change profile picture"
                >
                  <Camera className="h-3 w-3" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePictureChange}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500">Account</p>
                <p className="text-lg font-semibold text-slate-800">
                  {form.firstName} {form.lastName}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{form.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-500" />
                <span>{form.role}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 xl:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep your contact details updated for account recovery and alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="first-name">
                  First Name
                </label>
                <Input
                  id="first-name"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="last-name">
                  Last Name
                </label>
                <Input
                  id="last-name"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="role">
                  Role
                </label>
                <Input id="role" value={form.role} disabled />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="contact-number">
                  Contact Number
                </label>
                <Input
                  id="contact-number"
                  value={form.contactNumber}
                  onChange={(e) => updateField("contactNumber", e.target.value)}
                  placeholder="09XX XXX XXXX"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="office-address">
                  Office Address
                </label>
                <Textarea
                  id="office-address"
                  value={form.officeAddress}
                  onChange={(e) => updateField("officeAddress", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <Checkbox
                  checked={form.receiveEmailUpdates}
                  onCheckedChange={(checked) =>
                    updateField("receiveEmailUpdates", checked === true)
                  }
                />
                Receive weekly email updates
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <Checkbox
                  checked={form.receiveSystemAlerts}
                  onCheckedChange={(checked) =>
                    updateField("receiveSystemAlerts", checked === true)
                  }
                />
                Receive system alerts and account notices
              </label>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button className="cursor-pointer" onClick={handleSave}>Save Changes</Button>
              <Button className="cursor-pointer" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
