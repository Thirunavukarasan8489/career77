# Career77 — Instructions

## 1. Project Overview

Career77 is a next-generation job platform that connects candidates and recruiters through a modern, secure, scalable recruitment ecosystem.

The platform supports three primary roles:

1. Candidate
2. Recruiter
3. Super Admin

Career77 also supports paid training for candidates and subscription-based features for recruiters.

This file is the master instruction for coding agents working on the Career77 codebase.

---

# 2. Source of Truth

The `docs/` directory is the primary product, design, and architecture documentation for Career77.

Before implementing any feature:

1. Read this `AGENTS.md`.
2. Identify the relevant documentation under `docs/`.
3. Read the relevant MD files.
4. Inspect the existing codebase.
5. Understand the current implementation.
6. Create an implementation plan.
7. Implement only the requested scope.
8. Validate the implementation.
9. Update documentation only when the actual product or architecture has intentionally changed.

Do not invent requirements that are not defined in the documentation or requested by the user.

When documentation and existing code conflict:

- Do not silently choose one.
- Identify the conflict.
- Prefer the latest explicit product decision from the user.
- Explain the conflict before making a large architectural change.
- Ask the open question and implement the best solution.

---

# 3. Documentation Structure

The Career77 documentation is organized as follows:

```text
docs/
│
├── 01-product/
│   ├── product-overview.md
│   ├── information-architecture.md
│   ├── user-roles.md
│   └── user-journeys.md
│
├── 02-public/
│   └── Public website documentation
│
├── 03-candidate/
│   └── Candidate experience documentation
│
├── 04-training/
│   └── Paid training documentation
│
├── 05-recruiter/
│   └── Recruiter experience documentation
│
├── 06-admin/
│   └── Super Admin experience documentation
│
├── 07-design/
│   ├── design-system.md
│   ├── design-typography.md
│   ├── design-color-system.md
│   ├── design-spacing.md
│   ├── design-components.md
│   ├── design-layouts.md
│   ├── design-responsive.md
│   └── design-accessibility.md
│
├── 08-architecture/
│   ├── architecture-frontend.md
│   ├── architecture-backend.md
│   ├── architecture-database.md
│   ├── architecture-api.md
│   ├── architecture-authentication.md
│   ├── architecture-authorization.md
│   ├── architecture-rbac.md
│   └── architecture-file-storage.md
│
└── 09-platform/
    ├── platform-notifications.md
    ├── platform-messaging.md
    ├── platform-payments.md
    ├── platform-subscriptions.md
    ├── platform-support.md
    └── platform-audit-logs.md
```

Use only the relevant documentation for each task.

Do not read or modify every documentation file unnecessarily for a small feature.

---

# 4. Product Roles

Career77 has exactly three primary platform roles.

```text
Candidate
Recruiter
Super Admin
```

Do not introduce additional primary platform roles without explicit approval.

---

## 4.1 Candidate

Candidates can:

- Create and manage their profile
- Upload resumes
- Upload certificates
- Search and discover jobs
- Apply for jobs
- Track applications
- Participate in recruitment workflows
- Manage interviews where applicable
- Purchase paid training
- Access purchased/enrolled training
- Make payments
- Manage their account
- Contact support
- Receive platform notifications
- Communicate with recruiters where authorized

Candidate data must be protected by authentication, authorization, and ownership checks.

A candidate must not access another candidate's private data.

---

## 4.2 Recruiter

Recruiters can:

- Register
- Enter recruiter details
- Enter company details
- Complete verification
- Wait for Super Admin approval
- Access the Recruiter Portal after approval
- Manage company information
- Create and manage job postings
- Manage applicants
- Manage hiring workflows
- Manage interviews
- Manage recruiter subscriptions
- Make payments
- Contact candidates where authorized
- Contact support

Recruiter onboarding follows this workflow:

```text
Recruiter
    ↓
Register
    ↓
Enter Details
    ↓
Validate Details
    ↓
Create Account + Company Setup
    ↓
Super Admin Verification
    ↓
Approved?
    ├── Yes
    │    ↓
    │  Welcome Email
    │    ↓
    │  Login
    │    ↓
    │  Recruiter Dashboard
    │
    └── No
         ↓
       Rejected
         ↓
       Request Review
         ↓
       Super Admin Re-evaluation
```

A recruiter must not access another company's private data.

---

## 4.3 Super Admin

Super Admin manages platform-level operations.

Super Admin may manage:

- Candidates
- Recruiters
- Companies
- Recruiter verification
- Jobs
- Applications
- Paid training
- Payments
- Subscriptions
- Support
- Notifications
- Platform settings
- Audit logs

Super Admin actions must follow authorization rules and important administrative actions must be auditable.

---

# 5. Approved Technology Stack

Use the following technology stack unless the user explicitly approves a change.

```text
Framework:
Next.js 15+ with App Router

Frontend:
React
Next.js

Language:
TypeScript

Database:
MongoDB

ODM:
Mongoose

File Storage:
Cloudinary

Authentication:
NextAuth.js

Search:
MongoDB Text Indexes at Launch

Future Search:
Atlas Search / Lucene-based search if relevance or scale requires it

Styling:
Tailwind CSS

Hosting:
Vercel

Notifications:
Transactional Email Provider
WhatsApp Deep Links using wa.me
```

Do not introduce alternative frameworks or major infrastructure without justification and explicit approval.

---

# 6. Frontend Standards

Use:

- Next.js App Router
- Server Components by default
- Client Components only when required
- TypeScript
- Tailwind CSS
- Reusable components
- Clear component boundaries
- Responsive layouts
- Accessible UI

Prefer server-side data fetching when appropriate.

Use client-side state only when interaction requires it.

Avoid unnecessary client components.

Avoid duplicating UI logic across pages.

Reuse existing components before creating new ones.

---

# 7. Backend Standards

Backend logic must be structured and maintainable.

Separate:

```text
Routes / API
    ↓
Validation
    ↓
Authorization
    ↓
Business Logic
    ↓
Database
```

Do not place complex business logic directly inside UI components.

Keep reusable business logic in appropriate services or libraries.

Validate all external input.

Never trust client-provided authorization information.

Authorization must be enforced server-side.

---

# 8. Database Standards

Use MongoDB with Mongoose.

Database models must:

- Have clear schemas
- Use appropriate indexes
- Validate required fields
- Avoid unnecessary duplication
- Support scalable queries

Use indexes for frequently searched or filtered fields.

Do not fetch unnecessary fields when a projection is appropriate.

Avoid unbounded database queries.

Use pagination for large collections.

---

# 9. API Standards

API endpoints must:

- Validate input
- Authenticate users where required
- Authorize access
- Validate resource ownership
- Return consistent responses
- Handle errors safely
- Avoid exposing sensitive information

Recommended flow:

```text
Request
    ↓
Authentication
    ↓
Authorization
    ↓
Input Validation
    ↓
Business Logic
    ↓
Database
    ↓
Response
```

Do not rely on frontend authorization.

---

# 10. Authentication

Authentication determines who the user is.

Use NextAuth.js for authentication.

Authentication should support the Career77 user roles:

```text
Candidate
Recruiter
Super Admin
```

Protect authenticated routes.

Do not expose protected user data through public endpoints.

Authentication state must be validated server-side for protected operations.

---

# 11. Authorization

Authorization determines what an authenticated user is allowed to access.

Every protected operation must consider:

```text
Authenticated User
    ↓
Role
    ↓
Resource Ownership
    ↓
Company Relationship
    ↓
Business Permission
```

Examples:

```text
Candidate
→ Own profile
→ Own applications
→ Own training enrollments
→ Own payments
→ Own support tickets
```

```text
Recruiter
→ Authorized company
→ Authorized jobs
→ Authorized applicants
→ Authorized company subscription
```

```text
Super Admin
→ Authorized platform administration
```

Never assume that authentication alone provides authorization.

---

# 12. RBAC

Use role-based access control for high-level permissions.

Primary roles:

```text
candidate
recruiter
super_admin
```

RBAC should be combined with resource-level authorization.

Example:

```text
Recruiter
    ↓
Has Recruiter Role
    ↓
Belongs to Company A
    ↓
Job Belongs to Company A
    ↓
Access Allowed
```

A recruiter role alone does not automatically grant access to every recruiter resource.

---

# 13. File Storage

Use Cloudinary for supported file storage.

Potential file types include:

```text
Resumes
Certificates
Profile Images
Company Logos
Training Media
Support Attachments
```

The database should store file metadata and references.

Do not store large binary files directly in MongoDB unless explicitly required.

File access must follow authentication and authorization rules.

Private user files must not be exposed publicly without authorization.

Validate:

- File type
- File size
- Upload permissions

---

# 14. Payments

Career77 may process payments for:

```text
Candidate Paid Training
Recruiter Subscriptions
Future Paid Services
```

Payment flow:

```text
User
    ↓
Select Service
    ↓
Create Order
    ↓
Create Payment
    ↓
Payment Gateway
    ↓
Webhook / Verification
    ↓
Server-Side Verification
    ↓
Update Payment
    ↓
Activate Service
```

Never activate a paid service based only on frontend payment success.

Payment status must be verified server-side.

Payment webhooks must be idempotent.

Never store:

```text
Card Number
CVV
Payment Credentials
```

---

# 15. Subscriptions

Recruiter subscriptions control access to paid recruiter features.

Subscription architecture:

```text
Recruiter
    ↓
Select Plan
    ↓
Create Subscription
    ↓
Payment
    ↓
Server Verification
    ↓
Subscription Activated
    ↓
Feature Access
```

Keep these concepts separate:

```text
Plan
Subscription
Order
Payment
Usage
```

Subscription-controlled features must be checked server-side.

Subscription limits should be configurable.

Do not hardcode subscription limits throughout the application.

---

# 16. Paid Training

Candidates may purchase paid training.

Flow:

```text
Candidate
    ↓
View Training
    ↓
Select Training
    ↓
Payment
    ↓
Server-Side Verification
    ↓
Create Enrollment
    ↓
Grant Training Access
```

Training access must not be granted before successful payment verification.

Training enrollment and payment records should remain separate.

---

# 17. Messaging

Messaging may support authorized communication between:

```text
Candidate ↔ Recruiter
Candidate ↔ Support
Recruiter ↔ Support
Super Admin ↔ Candidate
Super Admin ↔ Recruiter
```

Messaging access must be based on authorization and business context.

Users must only access conversations they are authorized to view.

Messaging may use API-based communication initially.

Real-time messaging may be introduced later if required.

---

# 18. Notifications

Career77 may support:

```text
In-App Notifications
Transactional Email
WhatsApp Deep Links
```

Important events may trigger notifications.

Examples:

```text
Recruiter Approved
Recruiter Rejected
New Application
Interview Update
New Message
Payment Success
Payment Failure
Training Enrollment
Subscription Renewal
Support Reply
```

Notification delivery should be separated from core business logic where practical.

---

# 19. Support

Career77 uses support tickets.

Ticket lifecycle:

```text
Open
    ↓
Assigned
    ↓
In Progress
    ↓
Waiting for User
    ↓
Resolved
    ↓
Closed
```

Users must only access their authorized support tickets.

Super Admin manages platform support operations.

Support tickets may contain attachments and sensitive information.

Protect support data with proper authorization.

---

# 20. Audit Logs

Important platform actions must be auditable.

Audit events may include:

```text
Authentication
Account Changes
Recruiter Verification
Company Changes
Job Management
Application Management
Training
Payments
Subscriptions
Support
Administrative Actions
```

Audit logs should answer:

```text
Who
    ↓
Did What
    ↓
To Which Resource
    ↓
When
    ↓
From Where
```

Audit logs should generally be append-only.

Do not allow normal users to modify audit records.

Sensitive information such as payment credentials must never be stored in audit logs.

---

# 21. Design System

Career77 currently uses a **Light Theme Only**.

Do not implement dark mode at this stage.

The design system should focus on:

- Premium tech-modern UI
- Minimalist design
- High conversion
- Clean layouts
- Structural whitespace
- Strong typography
- High contrast
- Responsive design
- Accessibility

Primary design direction:

```text
Primary Accent:
#2536EB

Conversion Accent:
#10B981

Structural Neutral:
#0F172A

Surface:
#FFFFFF

Light Surface:
#F8FAFC
```

Typography should follow the documented Career77 typography system.

Use the design documentation under:

```text
docs/07-design/
```

When dark theme work begins, update the design documentation before implementing the dark theme.

---

# 22. Responsive Design

All user-facing interfaces must support:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Use responsive Tailwind utilities.

Do not create separate desktop and mobile implementations unless genuinely necessary.

Prefer responsive components and layouts.

---

# 23. Accessibility

Follow the accessibility documentation.

UI should include:

- Semantic HTML
- Keyboard navigation
- Accessible labels
- Visible focus states
- Appropriate contrast
- Accessible forms
- Meaningful error messages
- Responsive interaction patterns

Do not use color as the only method of communicating state.

---

# 24. Coding Standards

Use:

- TypeScript strict typing
- Meaningful names
- Small focused functions
- Reusable components
- Clear module boundaries
- Consistent formatting
- Consistent error handling

Avoid:

- `any` unless justified
- Duplicate code
- Dead code
- Unused imports
- Unnecessary abstractions
- Large monolithic components
- Business logic inside presentation components
- Hardcoded configuration values
- Hardcoded subscription limits

Prefer explicit and readable code over clever code.

---

# 25. Naming Conventions

Use consistent naming.

Examples:

```text
Components:
PascalCase

Functions:
camelCase

Variables:
camelCase

Types:
PascalCase

Constants:
UPPER_SNAKE_CASE

Files:
Follow the existing project convention
```

Do not introduce a new naming convention if the existing codebase already has an established convention.

---

# 26. Environment Variables

Secrets and environment-specific configuration must use environment variables.

Examples:

```text
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
PAYMENT_GATEWAY_KEY
PAYMENT_GATEWAY_SECRET
PAYMENT_WEBHOOK_SECRET
```

Never commit secrets to source control.

Never expose server-only secrets to client-side code.

Use `NEXT_PUBLIC_` only for values that are intentionally public.

---

# 27. Error Handling

Errors must be:

- Predictable
- Safe
- User-friendly
- Logged appropriately

Do not expose:

- Database errors
- Internal stack traces
- Secrets
- Infrastructure details

to end users.

Return useful user-facing messages while keeping technical details in server logs.

---

# 28. Security Rules

Always:

- Validate input
- Authenticate protected requests
- Authorize protected resources
- Validate resource ownership
- Protect sensitive files
- Protect environment secrets
- Rate-limit sensitive endpoints where appropriate
- Sanitize user-generated content
- Verify payment webhooks
- Prevent duplicate payment processing
- Audit sensitive administrative actions

Never trust client-provided:

```text
Role
User ID
Company ID
Payment Status
Permission
```

These must be verified server-side.

---

# 29. Performance Standards

Prefer:

- Server Components
- Server-side data fetching
- Appropriate caching
- Pagination
- Database indexes
- Efficient queries
- Image optimization
- Lazy loading where appropriate

Avoid:

- Unnecessary client-side fetching
- Unbounded database queries
- Loading large datasets at once
- Repeated duplicate API requests
- Unnecessary re-renders

Use Next.js caching and ISR where appropriate.

---

# 30. Search

At launch, use MongoDB text indexes.

Search architecture:

```text
Initial
    ↓
MongoDB Text Search
```

If search relevance, ranking, or scale requires improvement:

```text
Future
    ↓
MongoDB Atlas Search
    ↓
Lucene-Based Search
```

Do not introduce Atlas Search prematurely unless required.

---

# 32. Code Change Rules

When implementing a feature:

1. Understand the requested scope.
2. Read relevant documentation.
3. Inspect existing implementation.
4. Reuse existing code where possible.
5. Avoid unrelated refactoring.
6. Avoid unnecessary dependency additions.
7. Keep changes focused.
8. Maintain backward compatibility where possible.
9. Validate the implementation.
10. Report important assumptions or limitations.

Do not rewrite large parts of the application for a small feature.

---

# 33. Documentation Change Rules

Update documentation when:

- Product requirements change
- Architecture changes
- API behavior changes
- Authentication behavior changes
- Authorization rules change
- Data models significantly change
- New platform capabilities are introduced

Do not update documentation merely to describe temporary implementation details.

Documentation should describe the intended product and architecture.

---

# 34. Feature Implementation Workflow

For every feature, follow:

```text
1. Understand Request
        ↓
2. Read AGENTS.md
        ↓
3. Identify Relevant MD Files
        ↓
4. Inspect Existing Code
        ↓
5. Identify Dependencies
        ↓
6. Create Implementation Plan
        ↓
7. Implement
        ↓
8. Validate
        ↓
9. Run TypeScript Check
        ↓
10. Run Lint
        ↓
11. Run Tests
        ↓
12. Run Production Build When Appropriate
        ↓
13. Review Security
        ↓
14. Review Authorization
        ↓
15. Review Responsive UI
        ↓
16. Update Documentation If Required
```

---

# 35. Validation Checklist

Before completing a task, verify:

### Functional

- Feature works as requested
- Existing functionality is not broken
- Error states are handled
- Loading states are handled
- Empty states are handled

### Security

- Authentication is enforced
- Authorization is enforced
- Resource ownership is checked
- Sensitive information is protected

### UI

- Light theme is followed
- Responsive design works
- Accessibility requirements are followed
- Existing components are reused where possible

### Code

- TypeScript passes
- Lint passes
- Tests pass where available
- No unnecessary dependencies were added
- No unused code remains

### Documentation

- Relevant documentation was reviewed
- Documentation is updated only when required

---

# 36. Git and Change Discipline

Keep commits and changes focused.

Avoid mixing:

```text
Feature Development
+
Unrelated Refactoring
+
Formatting Changes
+
Dependency Updates
```

unless required.

Prefer small, understandable changes that can be reviewed independently.

---

# 37. Final Agent Rules

When working on Career77:

1. Treat `AGENTS.md` as the master project instruction.
2. Treat relevant files under `docs/` as the product and architecture source of truth.
3. Follow the three-role model: Candidate, Recruiter, Super Admin.
4. Follow the approved technology stack.
5. Use Light Theme Only for the current phase.
6. Enforce authentication and authorization server-side.
7. Enforce resource ownership and company-level access.
8. Never trust client-provided roles or permissions.
9. Never grant paid access without server-side payment verification.
10. Protect private files and user data.
11. Keep payment, subscription, order, and enrollment concepts separate.
12. Keep audit logs secure and append-only.
13. Reuse existing architecture and components.
14. Avoid unnecessary dependencies.
15. Avoid unrelated code changes.
16. Validate all implementation changes.
17. Update documentation when intentional product or architecture changes occur.
18. If requirements are unclear or conflicting, identify the issue instead of inventing a solution.
19. Prefer simple, maintainable, production-ready solutions.
20. Do not sacrifice security or data integrity for implementation speed.

---

# 38. Core Principle

Build Career77 as a:

```text
Secure
    ↓
Scalable
    ↓
Maintainable
    ↓
Accessible
    ↓
Responsive
    ↓
Production-Ready
```

platform.

Every implementation should align with:

```text
Product Requirements
        +
Design System
        +
Architecture
        +
Security
        +
User Roles
        +
Platform Rules
```

The goal is to build the requested feature correctly while preserving the consistency and long-term maintainability of the Career77 platform.
