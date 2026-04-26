# InformaKit Agency Backend - TODO

## Hero Section Fixes
- [x] Remove "verfügbar · q1 2026" status badge from top navigation
- [x] Fix floating CTA button overlapping hero stats area

## Inquiry (Anfrage) Page Redesign
- [x] Redesign inquiry page with modern dark purple/gradient brand aesthetic
- [x] Inquiry form captures: name, company, email, phone, service type, project description
- [x] Service type chips: Social Media, Web Design, Development, SEO, KI & Automation, Branding, Mobile App, Beratung
- [x] Budget range selection
- [x] File attachment upload support
- [x] Success confirmation after submission

## Database & Backend
- [x] Create inquiries table in database schema
- [x] Create inquiry_reports table for AI-generated reports
- [x] Public tRPC procedure for submitting inquiries
- [x] Admin tRPC procedures for listing/filtering/managing inquiries
- [x] File upload endpoint for inquiry attachments
- [x] Store attachments in S3 cloud storage

## AI Analysis System
- [x] Auto-trigger AI analysis on new inquiry submission
- [x] Use Manus Data API (Twitter, LinkedIn, YouTube) to research client social media
- [x] LLM-powered analysis: strategy plan, example posts, key insights
- [x] Generate actual PDF binary report (not HTML) using jsPDF
- [x] Store reports in S3 cloud storage
- [x] Link reports to inquiries in database

## Admin Dashboard
- [x] Admin-only dashboard with sidebar navigation
- [x] Inquiry list view with filtering (by status, service type)
- [x] Add date-based filtering to admin inquiry list
- [x] Inquiry detail view with all submitted data
- [x] View/download AI-generated PDF reports
- [x] Update inquiry status (new, in-progress, completed, archived)
- [x] Role-based access: only admin can access dashboard

## Notifications
- [x] Auto-notify owner when new inquiry is submitted

## Theme & Styling
- [x] Dark theme with purple/gradient brand colors matching InformaKit
- [x] Consistent design language across all pages
- [x] Google Fonts: Inter + Fira Code

## Tests
- [x] Inquiry submission tests (validation, success, error cases)
- [x] Admin access control tests (admin vs user vs unauthenticated)
- [x] Status update tests
- [x] Add tests for file upload and admin detail/report retrieval
