# Current Codebase Audit

This document assesses the current state of the Career77 codebase against the new architectural folder structure defined in `docs/07-design/7.9-design-project-structure.md`.

## 1. Project Root vs `src/` Directory
- **Target:** The design document suggests a `src/` directory.
- **Current State:** The project uses the root directory for Next.js features (`app/`, `components/`, `lib/`, `models/`).
- **Action:** We will continue using the root directory layout to minimize unnecessary sweeping migrations, adapting the target structure to apply at the root instead of inside `src/`.

## 2. App Router (`app/`)
- **Target:** Route groups for each experience: `(public)`, `(candidate-auth)`, `(candidate-portal)`, `(recruiter-auth)`, `(recruiter-portal)`, `(admin-auth)`, `(admin-portal)`.
- **Current State:** The `app/` directory currently lacks explicit route groups except for `(candidate)`. It contains:
  - `(candidate)`
  - `admin`
  - `api`
  - `companies`
  - `jobs`
  - `login`
  - `openings`
  - `recruiter`
  - `register`
- **Action:**
  - Create the target route groups.
  - Progressively migrate existing routes (e.g., `login`, `register`, `jobs`, `companies`) into their respective groups.

## 3. Components (`components/`)
- **Target:** `ui/`, `common/`, `layout/`, `auth/`, `public/`, `candidate/`, `recruiter/`, `admin/`.
- **Current State:** The `components/` directory has some subdirectories (`admin`, `candidate`, `providers`, `public`, `recruiter`, `ui`) but lacks `common`, `layout`, and `auth`. Furthermore, many layout and common components are sitting directly in the root of `components/` (e.g., `AdminLayoutClient.tsx`, `Navbar.tsx`, `Footer.tsx`, `DropdownMenu.tsx`, `Toast.tsx`).
- **Action:** 
  - Scaffold the missing directories (`common/`, `layout/`, `auth/`). 
  - Adopt `shadcn/ui` for the `ui/` directory.
  - Progressively migrate the root-level components into the proper categorized folders.

## 4. Backend, Core Domains, and Models
- **Target:** `features/`, `server/services/`, `server/repositories/`, `server/validators/`, `server/middleware/`, `lib/auth/`, `lib/db/`, and `models/` (at root as per user decision).
- **Current State:** 
  - `models/` exists at the root and contains 15 domain models (e.g., `User.ts`, `Job.ts`, `Candidate.ts`, etc.).
  - `lib/` exists and contains basic utilities (`apiClient.ts`, `auth.ts`, `db.ts`, etc.) but lacks organized subdirectories like `auth/` and `db/`.
  - `features/` and `server/` do not exist.
- **Action:**
  - Keep `models/` at the root, no migration needed.
  - Scaffold `features/` and `server/` and their subdirectories at the root.
  - Scaffold `lib/auth/` and `lib/db/` and progressively move the related root-level `lib` files inside them.

## Summary of Scaffolding Plan
We will scaffold the following at the project root to align with the progressive migration strategy:
- `app/(public)`
- `app/(candidate-auth)`
- `app/(candidate-portal)`
- `app/(recruiter-auth)`
- `app/(recruiter-portal)`
- `app/(admin-auth)`
- `app/(admin-portal)`
- `components/common`
- `components/layout`
- `components/auth`
- `features`
- `server/services`
- `server/repositories`
- `server/validators`
- `server/middleware`
- `lib/auth`
- `lib/db`
