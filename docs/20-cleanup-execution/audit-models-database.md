# Audit — Models & Database

## ODM: Mongoose with MongoDB

## Complete Model Inventory

### 1. User (`models/User.ts`)
**Fields:** `email`, `password`, `role` (`candidate` | `recruiter` | `superadmin`), `otp`, `otpExpiresAt`
**Indexes:** email (unique)
**Purpose:** Master authentication record for Recruiters and Super Admins. Candidates may optionally link.
**Issues:**
- `otp` and `otpExpiresAt` fields exist for OTP login but the OTP login flow for candidates uses the `Candidate` model, not `User`
- No `status` field (active/suspended/inactive) — cannot deactivate accounts without deleting them
- No `name` field — recruiter name must be fetched from the `Recruiter` model

---

### 2. Candidate (`models/Candidate.ts`)
**Fields:** `userId`, `name`, `email`, `mobile`, `experience`, `city`, `skills[]`, `lookingFor`, `bio`, `resumeUrl`, `resumePublicId`, `savedJobs[]`
**Indexes:** email, userId, savedJobs
**Relationships:** optional `userId` → User
**Issues:**
- `userId` is optional — Candidates registered via Quick Apply never get a User record, breaking support ticket creation
- No `status` field (active/deactivated)
- No `education` or `workExperience` structured fields — only free-text `experience` string
- No `profilePhotoUrl` field

---

### 3. Recruiter (`models/Recruiter.ts`)
**Fields:** `userId`, `companyId`, `name`, `email`, `password`, `companyName`, `designation`
**Indexes:** email, userId, companyId
**Relationships:** `userId` → User, `companyId` → Company
**Issues:**
- `password` is stored **redundantly** on both `User` and `Recruiter` models. The system stores a hashed password in both places.
- `companyId` is optional — a recruiter can exist without a company association
- `companyName` is stored directly on Recruiter even though Company model exists — redundant

---

### 4. Company (`models/Company.ts`)
**Fields:** `name`, `slug`, `logoUrl`, `logoPublicId`, `about`, `website`, `location`, `industry`, `verified`
**Indexes:** verified
**Issues:**
- No relationship back to Recruiters — cannot query "which recruiters belong to this company" without scanning Recruiter collection
- Missing `email`, `phone`, `size`, `founded` fields documented in product requirements

---

### 5. Job (`models/Job.ts`)
**Fields:** `title`, `slug`, `companyId`, `recruiterId`, `location`, `experience`, `experienceLevel`, `skills[]`, `description`, `salaryRange`, `employmentType`, `status` (`open` | `closed`), `postedAt`
**Indexes:** status+postedAt, location, skills, companyId, text index on title+description
**Issues:**
- Both `experience` (string) and `experienceLevel` (string) exist — unclear distinction, inconsistent use
- `status` only has `open` | `closed` — missing `draft`, `archived`, `paused` documented states
- No `applicationCount` denormalization (requires aggregate query on Application)

---

### 6. Application (`models/Application.ts`)
**Fields:** `jobId`, `candidateId`, `pipelineStageId`, `status` (`Applied` | `Shortlisted` | `Selected` | `Rejected`), `appliedAt`, `resumeUrl`, `notes`
**Indexes:** candidateId, jobId+status, jobId+candidateId (unique — duplicate prevention)
**Issues:**
- Status enum is `Applied` | `Shortlisted` | `Selected` | `Rejected` — missing `Screening`, `Interview`, `Offer`, `Hired` pipeline statuses documented in requirements
- `pipelineStageId` exists but the pipeline and application status are not synchronized

---

### 7. Interview (`models/Interview.ts`)
**Fields:** `applicationId`, `candidateId`, `recruiterId`, `jobId`, `scheduledAt`, `mode` (`video` | `phone` | `in-person`), `link`, `notes`, `status` (`scheduled` | `completed` | `cancelled`)
**Indexes:** candidateId+scheduledAt, recruiterId+scheduledAt
**Issues:**
- Missing `rescheduledAt`, `cancellationReason` fields
- No `companyId` field — cannot scope interviews to a company without joining through Job/Recruiter

---

### 8. PipelineStage (`models/PipelineStage.ts`)
**Fields:** order, name (to be verified)
**Issues:** Pipeline stage management API has no authentication — anyone can create/read pipeline stages

---

### 9. Subscription (`models/Subscription.ts`)
**Fields:** `companyId`, `plan` (`Free` | `Starter` | `Enterprise`), `status` (`active` | `past_due` | `cancelled`), `renewsAt`, `amount`
**Indexes:** companyId
**Issues:** Plans are hardcoded enum values — cannot add plans without a schema change. No `features` or `limits` embedded.

---

### 10. SupportTicket (`models/SupportTicket.ts`)
**Fields:** `raisedBy` (User ref), `userRole`, `subject`, `message`, `category`, `status` (`open` | `in_progress` | `resolved`), `responses[]`
**Issues:**
- `raisedBy` references `User` — but Candidates without a User record cannot raise tickets
- Missing `closed` status in the lifecycle documented in requirements (`Open → Assigned → In Progress → Waiting → Resolved → Closed`)
- Missing `assignedTo` field for ticket assignment

---

### 11. Notification (`models/Notification.ts`)
**Purpose:** Candidate job-match notifications
**Issues:** Only supports Candidate notifications — no Recruiter notifications

---

### 12. CmsContent (`models/CmsContent.ts`)
**Fields:** `key`, `content`
**Issues:** No authentication guard on PUT API — any user can update CMS

---

### 13. AuditLog (`models/AuditLog.ts`)
**Status:** Model file exists. No API endpoint creates audit log entries. The AuditLog model is unused.

---

### 14. Invoice (`models/Invoice.ts`)
**Status:** Model file exists. No API uses it currently. Billing webhook is a stub.

---

### 15. VerificationRequest (`models/VerificationRequest.ts`)
**Fields:** `companyId`, `documentUrl`, `status`, `submittedAt`
**Issues:** `POST /api/verification` uses `Company.findOne({})` with no filter — finds first company, not the recruiter's company

---

## Model Relationship Map (Actual)

```
User (auth record)
  ↓ optional
Recruiter
  ↓ optional
Company ← Subscription
  ↓
Job ←── VerificationRequest (on Company)
  ↓
Application (Candidate + Job)
  ↓
Interview (Application + Candidate + Recruiter + Job)

Candidate (profile + resume + savedJobs)
  ↓ optional userId → User

SupportTicket (raisedBy → User)
Notification (candidateId → Candidate)
CmsContent (standalone)
AuditLog (unused)
Invoice (unused)
PipelineStage (standalone, unlinked to Application)
```

## Summary

| Model | Status | Issues |
|---|---|---|
| User | ✅ Working | No status field |
| Candidate | ✅ Working | userId optional breaks support flow |
| Recruiter | ✅ Working | Redundant password storage |
| Company | ✅ Working | Missing reverse recruiter relationship |
| Job | ✅ Working | Duplicate experience fields, limited status enum |
| Application | ✅ Working | Limited status enum |
| Interview | ✅ Working | Missing companyId scope |
| PipelineStage | ⚠️ Partial | No auth, unlinked to Applications |
| Subscription | ⚠️ Partial | Hardcoded plan enum |
| SupportTicket | ⚠️ Partial | Missing statuses, assignedTo |
| Notification | ✅ Working | Candidate only |
| CmsContent | ⚠️ Partial | No auth on write |
| AuditLog | 🔴 Unused | Model exists, no usage |
| Invoice | 🔴 Unused | Model exists, no usage |
| VerificationRequest | ⚠️ Partial | Company lookup bug |
