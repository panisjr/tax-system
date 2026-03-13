"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/ui/ValidatedInput";

interface Permission {
  id: number;
  name: string;
}

interface PermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permission?: Permission | null; // If present, we are in EDIT mode
}

export function PermissionDialog({
  isOpen,
  onClose,
  onSuccess,
  permission,
}: PermissionDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (permission) {
      setName(permission.name);
    } else {
      setName("");
    }
  }, [permission, isOpen]);

  const handleScrubbedChange = (val: string) => {
    // Allow alphanumeric, spaces, apostrophes, dots, underscores, hyphens. Blocks emojis.
    const clean = val.replace(/[^a-zA-Z0-9 .\_\-']/g, ""); 
    setName(clean);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    const endpoint = permission
      ? "/api/permissions/update"
      : "/api/permissions/create";
    const payload = permission ? { id: permission.id, name } : { name };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to save permission", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-425px rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-lexend text-xl">
            {permission ? "Edit Permission" : "Add Permission"}
          </DialogTitle>
          <DialogDescription className="font-inter">
            {permission
              ? "Update the permission name."
              : "Create a new system access level."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ValidatedInput
            label="Permission Name"
            value={name}
            onChange={handleScrubbedChange}
            placeholder="e.g. system.manage" 
            maxLength={50}
            required
            validator="permission-&-role-name"
            type="text"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="font-inter">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !name}
            className="bg-[#0F172A] hover:bg-slate-800 font-inter text-white"
          >
            {isSubmitting
              ? "Processing..."
              : permission
                ? "Save Changes"
                : "Add Permission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
