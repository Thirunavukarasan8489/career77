# Career77 — Production Launch Checklist

## Application
- [x] Production build successful
- [x] Vercel compilation and build checks passing
- [x] Production routes configuration verified
- [x] HTTPS redirects enforced at Edge layer

## Database
- [x] MongoDB connection pooling verified
- [x] Production compound indexes verified
- [x] Master User collection indexing complete

## Authentication
- [x] Candidate cookie session signature verified
- [x] Recruiter NextAuth credentials logic verified
- [x] Super Admin NextAuth access control verified
- [x] Session expiration settings configured

## Authorization
- [x] Candidate role verification active
- [x] Recruiter role verification active
- [x] Super Admin role verification active
- [x] Company-level horizontal data isolation verified

## Files
- [x] Cloudinary upload parameters validated
- [x] Resume and certificate size bounds verified
- [x] Profile image upload verified

## Payments
- [x] Recruiter subscription updates check company ownership
- [x] Payment verification checks verified server-side

## Subscriptions
- [x] Recruiter approval middleware guard verified
- [x] Subscribed plan parameters validation verified

## Notifications
- [x] Transactional email template scripts verified
- [x] WhatsApp deep-links configured securely using `wa.me`

## Security
- [x] No API secrets committed to Git repository
- [x] No sensitive logs printed
- [x] Safe HTTP response status codes verified

## SEO
- [x] Sitemap verified
- [x] Robots tags block private pages from crawlers
- [x] Dynamic JSON-LD structured job postings verified

## Monitoring
- [x] Server-side error logging verified

## Rollback
- [x] Vercel git-commit rollback plan verified
