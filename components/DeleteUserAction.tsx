import Swal from 'sweetalert2';

/**
 * Display a confirmation dialog then call the delete user API.
 *
 * Returns `true` when the user was successfully removed (and the success
 * notification shown).  When the user cancels or an error occurs, `false`
 * is returned and an appropriate alert will already have been displayed.
 */
export async function deleteUser(empID: string, name: string): Promise<boolean> {
  const result = await Swal.fire({
    html: `
      <div class="text-left">
        <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">
          Delete User
        </h2>
        <p class="font-inter text-sm text-slate-500 mb-4">
          You are about to remove 
          <span class="font-semibold text-[#0F172A]">${name}</span>.
        </p>
        <div class="font-inter text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-md px-3 py-2">
          This action cannot be undone.
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Delete User',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
    background: '#ffffff',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-xl p-6 shadow-lg',
      confirmButton:
        'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
      cancelButton:
        'border border-gray-200 text-slate-600 text-xs font-inter px-4 py-2 rounded-md hover:bg-gray-50 transition mr-2',
    },
  });

  if (!result.isConfirmed) {
    return false;
  }

  try {
    const res = await fetch('/api/user/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empID }),
    });

    const data = await res.json();

    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Unable to delete user',
        text: data.error || 'An error occurred while deleting the user.',
      });
      return false;
    }

    await Swal.fire({
      html: `
        <div class="text-left">
          <h2 class="font-lexend text-lg font-semibold text-[#0F172A] mb-2">
            User Deleted
          </h2>
          <p class="font-inter text-sm text-slate-500">
            ${name} has been successfully removed.
          </p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      buttonsStyling: false,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-xl p-6 shadow-lg',
        confirmButton:
          'bg-[#0F172A] text-white text-xs font-inter px-4 py-2 rounded-md hover:bg-slate-800 transition',
      },
    });

    return true;
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Unable to connect to server.',
    });
    return false;
  }
}
