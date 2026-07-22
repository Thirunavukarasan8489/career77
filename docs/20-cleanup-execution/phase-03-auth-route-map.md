# Phase 3 — Auth Route Map

## Authentication Table
| Role | Flow | Route | Page | API | Status |
|---|---|---|---|---|---|
| Candidate | Login | `/login` | `login/page.tsx` | `/api/candidates/otp` | Implemented |
| Candidate | Register | `/register` | `register/page.tsx` | `/api/candidates` | Implemented |
| Candidate | Forgot Password | N/A (OTP based) | N/A | N/A | N/A |
| Candidate | Reset Password | N/A | N/A | N/A | N/A |
| Candidate | Email Verification | N/A | N/A | N/A | N/A |
| Recruiter | Login | `/recruiter/login` | `recruiter/login/page.tsx` | `/api/auth/[...nextauth]` | Implemented |
| Recruiter | Request Access | `/recruiter/register` | `recruiter/register/page.tsx` | `/api/recruiter/register` | Implemented |
| Recruiter | Forgot Password | N/A | N/A | N/A | N/A |
| Recruiter | Reset Password | N/A | N/A | N/A | N/A |
| Super Admin | Login | `/admin/login` | `admin/login/page.tsx` | `/api/auth/[...nextauth]` | Implemented |
| Super Admin | Forgot Password | N/A | N/A | N/A | N/A |
| Super Admin | Reset Password | N/A | N/A | N/A | N/A |
