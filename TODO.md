# Task: Implement AddRoleDialog for /user/manage (similar to PermissionDialog)

## Plan Status: ✅ Approved by user

## TODO Steps:

### 1. **Create components/AddRoleDialog.tsx** ✅ **COMPLETE**
   - Implemented full dialog modeled after PermissionDialog
   - Includes name input, permission multi-select picker, edit support
   - Internal API calls to /api/roles/create & update
   - Props: isOpen, onClose, onSuccess, role?, permissions[]

### 2. **Refactor app/user/manage/page.tsx** ✅ **COMPLETE**
   - Removed all inline role modal code (states, handlers, JSX) 
   - Added clean AddRoleDialog usage like PermissionDialog pattern
   - Wired openRoleDialog, handleDialogClose/Success
   - Updated Add/Edit buttons, columns deps
   - Added AddRoleDialog JSX at end inside main

### 3. **Testing & Validation** ⬜ [PENDING]
   - Test add new role (name + permissions)
   - Test edit existing role (prepopulate permissions)
   - Verify table refreshes correctly after save/delete
   - Check responsive UI + edge cases (no permissions, duplicates)

### 4. **Final Completion** ⬜ [PENDING]
   - attempt_completion

**Progress: 2/4 steps complete**
