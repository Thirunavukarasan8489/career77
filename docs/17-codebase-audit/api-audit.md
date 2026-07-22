# API Audit

| Method | Endpoint | Purpose | Auth | Role | Validation | Model | Used By | Status |
|---|---|---|---|---|---|---|---|---|
| `GET` | `/api/candidates` | Get Candidate profile | Yes | Candidate | None | Candidate | Candidate pages | FULLY IMPLEMENTED |
| `POST` | `/api/candidates/saved-jobs` | Save bookmarked job | Yes | Candidate | ObjectId | Candidate | Candidate pages | FULLY IMPLEMENTED |
| `GET` | `/api/verification` | Get approvals queue | Yes | Super Admin | None | VerificationRequest | Admin pages | FULLY IMPLEMENTED |
| `PATCH` | `/api/verification` | Verify company status | Yes | Super Admin | Status field | VerificationRequest | Admin pages | FULLY IMPLEMENTED |
