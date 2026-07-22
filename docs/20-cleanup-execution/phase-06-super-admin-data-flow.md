# Phase 6 — Super Admin Data Flow

*   **View Verification Requests**: Admin client requests `GET /api/verification` -> NextAuth session validation intercepts query -> verifies `user.role === 'superadmin'` -> returns VerificationRequest populated collections.
*   **Update Verification Status**: Admin calls `PATCH /api/verification` -> verifies role -> updates verified properties on target company.
