# Career77 — Component Inventory: Saved Jobs

## Component: SaveJobButton
*   **Purpose**: Toggles saving/bookmarking status.
*   **Existing/New**: New component.
*   **Props**: `jobId: string`, `initialSaved: boolean`
*   **Variants**: Card Button (minimalist, icon only), Page Button (with text label).
*   **States**: Default, Hover, Active, Loading, Disabled.
*   **Responsive**: Touch target expands to `44x44px` on mobile layouts.
*   **Accessibility**: Implements `aria-label="Save Job"` and visible outline focus states.
