import Swal from "sweetalert2";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

export { Swal };

/**
 * Show a custom styled delete success dialog.
 */
export async function showDeleteSuccess(name: string) {
  const checkIcon = renderToStaticMarkup(
    <CheckCircle2 size={14} className="text-emerald-500 mr-2" />,
  );
  await Swal.fire({
    width: 300,
    html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">
          User Deleted
        </h2>
        <p class="font-inter text-sm text-slate-500 mb-4">
          <span class="font-lexend font-semibold text-[#0F172A]">${name}</span>
          <br>has been successfully removed.
        </p>
        <div class="flex items-start font-inter text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
            ${checkIcon}
            <span>User account deleted.</span>
        </div>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "OK",
    buttonsStyling: false,
    background: "#ffffff",
    customClass: {
      popup: "rounded-xl p-6 shadow-lg",
      confirmButton:
        "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
    },
  });
}

/**
 * Show a generic error dialog with an optional title.
 */
export async function showError(message: string, title = "Error") {
  await Swal.fire({
    icon: "error",
    title,
    text: message,
  });
}

/**
 * Show a confirmation dialog for deleting an entity and return whether the
 * user confirmed the action.
 * 
 * @param name - The name/identifier of the entity to delete
 * @param entityType - The type of entity being deleted (default: "User")
 */
export async function confirmDelete(name: string, entityType = "User"): Promise<boolean> {
  const cautionIcon = renderToStaticMarkup(
    <AlertTriangle size={14} className="text-rose-500 mr-2" />,
  );
  const result = await Swal.fire({
    width: 300,
    html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">
          Delete ${entityType}?
        </h2>
        <p class="font-inter text-sm text-slate-500 mb-4">
          You are about to remove 
          <span class="fontr-lexend font-semibold text-[#0F172A]"><br>${name}</span>.
        </p>
        <div class="flex items-start font-inter text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-md px-3 py-2">
            ${cautionIcon}
            <span>This action cannot be undone.</span>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: `Delete ${entityType}`,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
    background: "#ffffff",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-xl p-6 shadow-lg",
      confirmButton:
        "bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition",
      cancelButton:
        "border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2",
    },
  });

  return result.isConfirmed;
}
