# Authorization and RBAC Audit

## Authorization Matrix
| Resource | Candidate | Recruiter | Super Admin | Server Enforced |
|---|---|---|---|---|
| Candidate Saved Jobs | Allow | Deny | Deny | Yes |
| Company Settings | Deny | Allow | Deny | Yes |
| Admin Support Tickets | Deny | Deny | Allow | Yes |
