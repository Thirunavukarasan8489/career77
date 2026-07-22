# Folder Structure Audit

## 1. Repository Overview
Career77 repository follows Next.js App Router conventions with separate folders for database schemas, context configurations, helper scripts, and documentation files.

## 2. Top-Level Structure
*   `app/`: Routing pages and api endpoints
*   `components/`: Reuse UI modules
*   `lib/`: Database and session helper scripts
*   `models/`: Mongoose schemas
*   `docs/`: Product design manuals

## 3. Frontend Structure
Next.js App router with Candidate, Recruiter, and Admin portals grouped under `app/`.

## 4. Backend Structure
Server routes are situated inside `app/api/` matching path structures.

## 5. Database Structure
Mongoose connection pooling scripts are located inside `lib/db.ts` and models are under `models/`.

## 6. API Structure
Standard Next.js route handlers map HTTP methods.

## 7. Authentication Structure
Candidate authentication is verified via signed session tokens, while Recruiter and Admin authenticate via NextAuth Credentials.

## 8. Authorization Structure
Middleware layers (`middleware.ts`) intercept unverified recruiters, while API handlers query role mappings.

## 9. Component Structure
General elements reside in `components/`.

## 10. Shared Libraries
Consolidated inside `lib/`.

## 11. Utility Structure
Contains formatting functions.

## 12. Testing Structure
None.

## 13. Documentation Structure
Organized under `docs/`.

## 14. Duplicate Structures
None.

## 15. Orphaned Folders
An empty `app/api/training` folder was removed in Phase 8.

## 16. Unexpected Folders
None.

## 17. Architecture Violations
None.

## 18. Recommendations
Consolidate any lingering mock elements in components post-launch.
