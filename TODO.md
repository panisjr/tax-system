# Tax Declaration Modal Repositioning Task

## Plan Overview
Move "Details & Reference" modal under "Print Review" and "Save Tax Declaration" buttons in sidebar of `app/property/new-td/page.tsx`. Make sticky and non-closable.

**Status: [x] Complete**

## Steps
- [x] Step 1: Remove `isDetailsOpen` state and `setIsDetailsOpen` references
- [x] Step 2: Move Dialog block after buttons div in sidebar
- [x] Step 3: Update Dialog to `open={true}` (remove onOpenChange)
- [x] Step 4: Add sticky positioning to DialogContent (lg:sticky lg:top-[170px] z-30)
- [x] Step 5: Test layout on desktop/mobile, verify non-dismissible
- [x] Step 6: Mark complete

**Completed Steps:** All steps completed successfully.

