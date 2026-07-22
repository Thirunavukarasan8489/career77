# Career77 — Production Operations Guide

## 1. Production Architecture
Career77 is deployed on Vercel utilizing Next.js Server Components by default, integrated with MongoDB Atlas for persistent storage and Cloudinary for file attachments.

## 2. Deployment Process
Deployments are initiated automatically via Vercel GitHub integration when code is merged into the production branch.

## 3. Environment Variables
Server secrets are configured securely inside the Vercel dashboard settings.

## 4. Vercel Operations
Log stream levels can be monitored directly inside the Vercel Deployments dashboard tab.

## 5. MongoDB Operations
Database clusters are monitored for execution latency using Atlas Dashboard alerts.

## 6. Cloudinary Operations
Assets are uploaded using client-signed signature verification endpoints.

## 7. Payment Operations
Subscriptions are verified and locked to specific company identifiers server-side.

## 8. Subscription Operations
Recruiter verification states are cached in JWT layers, intercepting unauthorized access attempts at the Edge.

## 9. Email Operations
Email notifications are delivered using transactional email routes.

## 10. Monitoring
Serverless function logs are monitored via Vercel Runtime logs.

## 11. Error Handling
All errors return uniform JSON status objects. Stack traces are suppressed.

## 12. Incident Management
Incidents are classified into severity levels (P0-P3) and recorded inside the incident log.

## 13. Hotfix Process
Hotfixes must originate from a dedicated hotfix branch and undergo full production build checks before merging.

## 14. Rollback Process
Vercel allows single-click instant rollbacks to previous stable commits.

## 15. Backup and Recovery
MongoDB Atlas automated backups execute daily with a 7-day retention period.

## 16. Security Incident Process
Outages or security leaks require immediate lock-down, log audits, hotfixes, and documentation.

## 17. Support Escalation
Tickets are moderated inside the Super Admin Support desk portal.

## 18. Emergency Contacts
Admin support: operations@career77.com.
