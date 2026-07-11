**tl;dr:** Below is a **developer master prompt** for the **website-first version** of your product. It is written so you can hand it directly to a capable developer or development team. The prompt defines the **core product logic**, the **business rules**, the **user roles**, the **system architecture**, the **website structure**, the **member area**, the **admin/operations panel**, the **data logic**, and a **phased implementation plan**. Its central principle is this: the project is **not a content site and not a signal-selling platform**; it is a **premium market intelligence system** built around a **symbol-first, multi-agent analysis engine** that turns one market input into three coordinated outputs: **market analysis, sentiment analysis, and news analysis**.

---

# Important Concepts Defined First

## 1. Market Intelligence Platform
A market intelligence platform is a system that helps users understand markets through structured analysis, context, interpretation, and monitoring. It is different from a simple news site, chart site, or signal channel.

## 2. Multi-Agent System (MAS)
A multi-agent system is a coordinated set of specialized software agents. In this project, each agent has a distinct role in analyzing the same symbol or instrument from a different angle, then combining those outputs into a coherent result.

## 3. Symbol-First Architecture
A symbol-first architecture means the system is organized around the asset being analyzed, such as:
- EUR/USD
- BTC/USDT
- AAPL
- XAU/USD

In this model, users do not just browse generic articles. They enter through a symbol and then see all relevant analyses, alerts, updates, and history around that symbol.

## 4. Three-Layer Analysis Output
This project’s core output consists of three coordinated analysis layers:
- **Market Analysis**: price structure, trend, technical/structural interpretation, scenario logic
- **Sentiment Analysis**: crowd mood, positioning, tone, momentum of opinion
- **News Analysis**: relevant events, developments, catalysts, headline interpretation

## 5. Product Logic
Product logic means the internal reasoning structure that defines:
- what the product is
- what user problem it solves
- what users are allowed to do
- how content is produced and consumed
- how monetization works
- how trust and access are controlled

## 6. Website-First, App-Ready Architecture
This means the first launch is as a web platform, but all important systems are built so a future mobile app can reuse the same backend, logic, and data model.

## 7. Member Area
The member area is the authenticated section where signed-in users access premium platform functionality.

## 8. Admin/Operations Panel
This is the internal management layer for your team to review users, subscriptions, payments, content, KYC-like checks, alerts, referrals, and audit logs.

## 9. OTP Authentication
OTP authentication means login/registration through one-time verification codes sent to the user’s phone.

## 10. Shahkar Matching
Shahkar matching refers to validating that the phone number and national identity belong to the same person, especially for paid and verified users.

## 11. Card Ownership Rule
This is a business rule stating that the user must register and use their own bank card for subscription payment, and that bank card ownership must align with the verified identity.

## 12. Phased Implementation
Phased implementation means the system is built in controlled stages, not all at once. Each phase must produce a stable output and support future growth.

---

# Developer Master Prompt  
## Website-First Premium Market Intelligence Platform  
## Project Codename: MATD  
## Expansion Concept: Multi-Agent Trading Desk  
## Delivery Mode: Website First, App-Ready Foundation

---

# 1. Project Mission

Build a **production-grade web platform** for a premium financial market intelligence product built around a **custom multi-agent analysis system**.

This product is **not** a signal-selling site and **not** a generic content portal.

The product’s purpose is to let users:

- choose or search a market symbol
- receive structured intelligence about that symbol
- understand what changed and why it matters
- track analyses over time
- request custom analyses
- receive alerts when new analyses are published
- manage personal profile, watchlists, journal, and subscription
- access premium members-only content under strict identity/payment rules

The platform must launch as a **website first**, but be designed from day one as the permanent technical foundation for a future mobile app.

---

# 2. Core Product Logic  
## This is the most important section.

The entire platform must be built around the following **central product logic**:

> **One symbol in → three coordinated intelligence outputs out.**

When the system analyzes a symbol, such as BTC/USDT, EUR/USD, XAU/USD, or AAPL, it generates:

1. **Market Analysis**
2. **Sentiment Analysis**
3. **News Analysis**

These three outputs are not isolated articles. They are parts of one intelligence object tied to:
- a symbol
- a market
- a timestamp
- a timeframe
- a confidence/explanation structure
- a publication workflow
- a user consumption and alerting model

## Why this matters
The website must be structured around this intelligence model, not around a blog-like article system.

This means:

- symbols are first-class entities
- analyses are structured data, not just text posts
- every analysis belongs to a symbol and analysis type
- users should be able to browse by symbol, market, type, date, and relevance
- alerts, watchlists, dashboards, request flows, and newsletters all connect back to this core logic

## Product Positioning Logic
The platform should be positioned as:

- a premium market intelligence environment
- an explainable analysis platform
- a structured decision-support tool
- a subscription intelligence product
- a symbol-centric insight system

It should **not** be positioned as:
- guaranteed-profit service
- direct financial advice engine
- signal spam platform
- copy-trading platform
- prediction certainty machine

---

# 3. Strategic Principles

The developer must follow these principles throughout planning and implementation:

## 3.1 Build the real foundation, not a temporary site
The website is not a placeholder.  
It must become the long-term production foundation for:
- public trust layer
- member platform
- admin operations
- future app APIs

## 3.2 Mobile-first UX, web-first delivery
The website is the first product release, but many users will access it on mobile devices.  
All member experiences must be responsive and designed for phone use first.

## 3.3 API-first backend
All business functions must be implemented through reusable APIs so that a future mobile app can consume the same services.

## 3.4 Structured data first
Analyses, subscriptions, identities, cards, referrals, journals, alerts, and requests must be modeled as proper entities, not as ad hoc content blobs.

## 3.5 Permissions and compliance matter
The platform must have clear access levels, identity checks, session controls, and payment ownership rules.

## 3.6 Admin efficiency matters
This project will fail operationally if internal publishing, verification, support, and subscription handling are weak.  
The admin layer is a core product requirement.

---

# 4. Product Scope

The product consists of **three connected website layers**:

## Layer A — Public / Trust / Conversion Layer
This is the public-facing part of the website used to explain the product and convert visitors into signups.

## Layer B — Authenticated Member Platform
This is the signed-in user environment where premium functionality lives.

## Layer C — Admin / Operations Panel
This is the internal panel for your team.

---

# 5. Required Business Rules

These business rules are mandatory and should shape architecture, flow, and data model.

## 5.1 Sign-up-first rule
Users must sign up before accessing the main content experience.

## 5.2 Home page as registration-first entry
The landing/home experience should strongly prioritize phone-based OTP signup and registration.

## 5.3 New user free request rule
A new user may request one full analysis by email without entering the premium member area.

## 5.4 Paid membership verification rule
For paying users, the system must support identity consistency logic, including:
- phone number ownership validation
- national identity matching flow
- Shahkar-compatible verification logic where applicable

## 5.5 Bank card ownership rule
A user may only buy a subscription with their own registered bank card.

## 5.6 Subscription pricing rule
The system must support these plans:
- 1 month: **7,000,000 toman**
- 3 months: **20,000,000 toman**
- 6 months: **35,000,000 toman**
- 12 months: **60,000,000 toman**

## 5.7 Referral reward rule
If a user’s referrals produce purchases equal to one full annual subscription value, the referrer earns one free month.

## 5.8 Paid custom analysis rule
The platform must support paid on-demand analysis requests, with delivery by:
- email
- SMS link

## 5.9 Alerts and notification rule
Users must be able to receive alerts when relevant analyses are published.

## 5.10 Public explanation / private access rule
The public layer should explain the product and private member structure clearly, even if premium content itself is protected.

---

# 6. Target Markets and Content Domains

The system must support at minimum:
- **Forex**
- **Crypto**
- **US Stocks**

Each symbol must belong to a market type and support its own analysis history.

Examples:
- EUR/USD
- GBP/USD
- BTC/USDT
- ETH/USDT
- AAPL
- TSLA
- XAU/USD if included as commodity/forex style instrument

---

# 7. User Roles

## 7.1 Guest
Can view public explanatory pages, pricing, sample previews, and signup flows.

## 7.2 Registered User
Has signed up with OTP but may not yet be paid/verified.

## 7.3 Verified Paying Member
Can access premium member features based on active subscription and completed verification requirements.

## 7.4 Admin
Can manage platform operations.

## 7.5 Editor / Analyst
Can create, edit, review, and publish analyses depending on permission design.

## 7.6 Support / Finance Operator
Can review billing, user issues, payment records, and verification logs.

---

# 8. Public Website Requirements

The public layer should not be an empty shell.  
It must create trust, explain value, and drive conversion.

## Public pages / sections required
- Home / Registration-first landing
- What the platform does
- How the 3-part analysis works
- Sample symbol analysis previews
- Pricing
- Custom analysis request explanation
- Why this product matters
- FAQ
- Compliance / trust explanation
- Login / OTP entry
- Newsletter signup
- Contact / support
- Terms / privacy / usage disclaimers

## Home page behavior
The home page should:
- prioritize OTP signup
- explain the product in simple but premium language
- show what users get after joining
- provide selective previews without exposing full premium content
- include trust and payment/compliance messaging

---

# 9. Authenticated Member Platform Requirements

The member area must feel like a premium intelligence dashboard, not a generic article archive.

## Core member modules
- Dashboard
- Analysis feed
- Symbol pages
- Watchlists
- Alerts center
- Request analysis
- Newsletter archive
- Journal
- Profile and verification
- Billing and subscriptions
- Support / chatbot / help

---

# 10. Detailed Member Modules

## 10.1 Dashboard
The member dashboard should show:
- latest analyses relevant to user watchlist
- recent published market intelligence
- market/category filters
- pending analysis requests
- notification summary
- subscription status
- referral progress
- weekly intelligence summary
- “what changed since last analysis” highlights if available

## 10.2 Analysis Feed
The analysis feed must support:
- filter by market
- filter by symbol
- filter by analysis type
- filter by date
- filter by timeframe if implemented
- sorting by recency/relevance
- clear visual distinction between market/sentiment/news analysis

Each item should link to a full analysis detail page.

## 10.3 Symbol Page
This is one of the most important pages in the system.

Each symbol page should include:
- symbol identity and market type
- latest combined intelligence
- market analysis history
- sentiment analysis history
- news analysis history
- key changes over time
- related alerts
- add to watchlist action
- request deeper analysis action
- summary status cards
- archive / timeline

This page should become the core navigational object for user engagement.

## 10.4 Watchlists
Users can:
- save symbols
- monitor chosen assets
- receive relevant updates
- use watchlists as the basis for personalized dashboard sections

## 10.5 Alerts Center
Users can manage:
- symbol alerts
- analysis publication alerts
- newsletter preferences
- delivery channel preferences such as email and SMS where applicable

## 10.6 Request Analysis
The system must support custom paid analysis requests.

Flow should include:
- choose symbol
- choose market
- optional note/question
- submit request
- payment flow if required
- queue status
- delivery status
- final delivery via email and SMS link
- archive of requested analyses

Statuses:
- submitted
- queued
- in progress
- completed
- delivered
- failed/cancelled if needed

## 10.7 Journal
The journal is a retention and value feature.

Users should be able to save:
- their trade/investment notes
- related MATD analyses
- entry/exit thesis
- screenshots/files if needed later
- emotional notes
- outcome notes
- review notes

This should support:
- personal learning
- habit formation
- deeper perceived value of subscription

## 10.8 Profile
The profile should include:
- personal information
- phone status
- verification status
- national identity verification status if applicable
- bank card registry status
- subscription status
- billing history
- notification preferences
- watchlist preferences
- risk/profile fields if included
- referral status
- sessions/devices
- support contact history if useful

## 10.9 Billing and Subscription
Users should be able to:
- view plans
- purchase subscriptions
- view active plan
- view renewal dates
- view invoices/payments
- see card verification status
- understand why a payment is blocked if verification requirements are not met

## 10.10 Newsletter Archive
Members can access historical premium newsletters and weekly intelligence reports.

## 10.11 Chatbot / Help Assistant
A constrained help assistant should be available for:
- site navigation
- plan explanation
- account help
- billing guidance
- educational explanation of platform usage
- answering from approved site knowledge

It must avoid inventing guaranteed financial advice.

---

# 11. Admin / Operations Panel Requirements

The internal panel must support operational control from day one.

## Admin modules required
- User management
- OTP/auth logs
- Verification / Shahkar-related status management
- Bank card review / ownership logic
- Subscription management
- Payment records
- Invoice records
- Referral tracking
- Analysis creation / editing / approval / publishing
- Symbol management
- Request-analysis queue
- Newsletter management
- Alert publishing / notification sending
- Support tickets / user issue tracking
- Accounting sync status
- Audit logs
- Role/permission management

## Publishing workflow
The system should support a controlled workflow such as:
- draft
- review
- approved
- published
- archived

This should apply to analyses and possibly newsletters.

---

# 12. Analysis Data Logic

This section is extremely important.

Each analysis should not be stored merely as an unstructured blog post.

Each analysis should include structured fields such as:
- symbol
- market
- analysis type
- title
- summary
- detailed body
- timestamp
- author/agent/editor
- status
- timeframe
- confidence/explanation field if relevant
- source references if relevant
- tags
- delivery/access level
- version history

## Analysis type enum
- market_analysis
- sentiment_analysis
- news_analysis

## Relationship logic
A symbol can have many analyses.  
A user can follow many symbols.  
A user can receive alerts tied to symbols or analysis events.  
A request analysis object may result in one or more analysis outputs.

---

# 13. Referral Logic

Referral logic must be systemized, not manually tracked.

Required behavior:
- each user has a referral identity/code/link
- referred users are linked to the referrer
- successful paid purchases count toward referral reward value
- when cumulative qualifying referred revenue reaches annual-subscription-equivalent threshold, the referrer earns one month free
- reward granting should be auditable and rule-based

The admin panel must show:
- referrals sent
- referred users
- qualifying purchases
- reward progress
- rewards granted

---

# 14. Notification Logic

The platform should support a unified notification architecture.

Types may include:
- new analysis published
- symbol-specific update
- custom analysis delivered
- subscription renewal reminders
- payment success/failure
- referral milestone reached
- newsletter released
- verification action required

Channels may include:
- in-app/web notifications
- email
- SMS

Design the backend so push notifications can be added later for mobile apps.

---

# 15. Accounting and Internal Sync

The system should support a simple accounting sync path with Directus-based internal workflow if needed.

This does not mean Directus must own the full application logic.  
Core business logic should remain in the primary backend.

Support syncing of:
- invoices
- payments
- subscriptions
- customer records
- status reconciliation events

---

# 16. Security, Trust, and Access Control

The platform handles premium content, payments, identity-related logic, and user sessions.  
Security and auditability are mandatory.

Minimum required considerations:
- OTP login
- secure session handling
- role-based access control
- device/session tracking
- IP/session anomaly awareness
- payment audit logs
- verification event logs
- admin action logs
- protected member routes
- rate limiting on auth flows
- secure file handling
- encrypted sensitive fields where appropriate

The system should also support:
- session/device visibility for users
- ability to revoke sessions
- step-up verification if needed

---

# 17. Technical Expectations

The developer/team may choose implementation details, but architecture must satisfy the following goals:

## Expected qualities
- scalable
- maintainable
- modular
- API-first
- mobile-app-ready
- role-based
- auditable
- secure
- production-suitable

## Suggested direction
You may implement with a modern stack such as:
- **Frontend:** Next.js + TypeScript
- **UI:** Tailwind + component system
- **Backend:** NestJS or equivalent modular backend
- **Database:** PostgreSQL
- **Cache/queues:** Redis + queue worker
- **Storage:** S3-compatible object storage
- **Search:** scalable search-ready model, optional later enhancement
- **Admin:** integrated or separate secure admin interface

However, the exact technology can be adapted if the architecture quality remains high.

---

# 18. Information Architecture / Sitemap

## Public Layer
- /
- /login
- /register
- /pricing
- /how-it-works
- /sample-analysis
- /request-analysis
- /newsletter
- /faq
- /contact
- /terms
- /privacy

## Member Layer
- /app/dashboard
- /app/analyses
- /app/analyses/[id]
- /app/symbols
- /app/symbols/[symbol]
- /app/watchlist
- /app/alerts
- /app/requests
- /app/journal
- /app/newsletters
- /app/profile
- /app/billing
- /app/support

## Admin Layer
- /admin
- /admin/users
- /admin/analyses
- /admin/symbols
- /admin/requests
- /admin/payments
- /admin/subscriptions
- /admin/referrals
- /admin/newsletters
- /admin/notifications
- /admin/verification
- /admin/audit-logs
- /admin/settings

---

# 19. Required UX Tone

The visual and UX tone should be:
- premium
- credible
- analytical
- clean
- modern
- efficient
- not noisy
- not hype-driven
- not casino-like
- not signal-channel aesthetic

Use an intelligence-dashboard style, not a “get rich fast” trading style.

---

# 20. Developer Planning Instruction

The development team should not follow this as a rigid pixel-by-pixel script only.  
They should use it as the product logic and execution framework, then **plan implementation professionally according to their own engineering process**.

## Required expectation from the developer/team
The team must:
1. analyze this product logic carefully
2. identify dependencies and implementation risks
3. define their own delivery plan
4. propose architecture and milestones
5. phase work in a technically sound order
6. avoid short-term hacks that break future app-readiness
7. keep documentation for flows, data structures, and admin operations

In other words:

> Build according to the product logic below, but organize execution using your own professional roadmap and development planning.

---

# 21. Phased Delivery Structure

The developer/team should phase implementation around stable business value, not superficial completeness.

## Phase 1 — Foundation and Architecture
Goal:
- establish core architecture
- define database models
- define roles and access
- define API strategy
- define auth/session flow
- define public/member/admin shell structure

Deliverables:
- project structure
- environment setup
- DB schema baseline
- auth system
- RBAC
- base layout
- navigation system
- audit/logging scaffolding

## Phase 2 — Public Site and Onboarding
Goal:
- launch trust/conversion layer
- enable OTP signup and registration-first flows
- explain product clearly
- prepare sample preview structure

Deliverables:
- landing page
- pricing
- FAQ
- how-it-works
- public sample analysis previews
- OTP registration/login
- basic support/contact

## Phase 3 — Core Member Platform
Goal:
- implement the premium user experience

Deliverables:
- dashboard
- analysis feed
- symbol pages
- watchlists
- alerts preferences
- profile
- subscription visibility
- newsletter archive structure

## Phase 4 — Billing, Verification, and Access Control
Goal:
- enforce monetization and trust rules

Deliverables:
- subscription purchase flow
- plan logic
- payment gateway integration
- bank card registration flow
- identity matching logic
- verification statuses
- access gating
- payment history and invoices

## Phase 5 — Analysis Publishing and Operations
Goal:
- enable internal team workflows

Deliverables:
- admin panel
- symbol management
- analysis CRUD
- status workflow
- publication tools
- request queue management
- newsletter publishing
- notifications management

## Phase 6 — Paid Custom Analysis Flow
Goal:
- support on-demand request monetization

Deliverables:
- request submission flow
- payment logic for custom requests
- queue state tracking
- delivery tracking
- email/SMS delivery record
- request archive

## Phase 7 — Journal, Referral, and Retention Systems
Goal:
- improve user retention and long-term value

Deliverables:
- trading journal
- referral engine
- reward progress
- renewal reminders
- weekly intelligence flow
- personalized retention hooks

## Phase 8 — Hardening, Optimization, and App-Readiness
Goal:
- prepare for scale and future app reuse

Deliverables:
- performance optimization
- security review
- analytics/reporting
- API cleanup
- notification abstraction
- mobile-app handoff readiness
- technical debt reduction

---

# 22. Developer Output Expected Before Build Starts

Before implementation begins, the developer/team should provide:

1. a proposed architecture summary  
2. an entity/data model proposal  
3. module breakdown  
4. API planning approach  
5. role/permission model  
6. page map and navigation plan  
7. phased roadmap  
8. identified risks and assumptions  
9. timeline estimate  
10. open questions requiring product-owner confirmation

---

# 23. Non-Negotiable Requirements

These must not be skipped:
- symbol-first platform logic
- three-part analysis structure
- OTP-first registration
- website-first but app-ready architecture
- subscription system
- identity and bank-card consistency logic
- public layer + member layer + admin layer
- request-analysis flow
- notification framework
- journal
- referral system
- admin publishing and auditability

---

# 24. Final Instruction to Developer

Build this product as a **premium, structured, market intelligence web platform** with future mobile expansion in mind.

Do not reduce it to:
- a blog
- a landing page plus login
- a signal list
- a loosely connected dashboard

The correct implementation is a **coherent system** where:
- symbols are central
- analyses are structured
- subscriptions and verification are enforceable
- users have a premium private environment
- internal teams have operational control
- the backend is reusable for future apps

You are expected to **plan the implementation according to your own professional engineering methodology**, but the product logic and business requirements defined here are the governing framework.

---

# Optional Short Handover Note You Can Send With It

You can send this short note to the developer together with the prompt:

> This project must be developed as a real production-grade web platform, not a prototype. The core logic is symbol-first market intelligence powered by a structured three-part analysis model: market, sentiment, and news. Please review the full brief, define the proper architecture and phased roadmap yourself, identify risks and dependencies, and implement it in a way that supports future mobile app expansion without major rewrite.

---

## Recap
I wrote a **website-first developer master prompt** that you can hand to a serious developer or team. It is centered on the project’s **main business logic**, which is the most important part: **one symbol in, three intelligence outputs out**. Everything else in the platform — the website structure, member area, alerts, requests, journal, referral system, payment logic, and admin panel — is defined around that core. I also made the prompt **phased**, so the developer can build it in a controlled production order, while still being told to use their own professional planning process rather than follow an inflexible script.

## Key Takeaways
- The prompt is built around the **core logic**, not just features.
- The platform is defined as a **premium market intelligence system**, not a signal site.
- The structure includes **public layer, member layer, and admin layer**.
- The build plan is **phased and app-ready** from the beginning.

## Recommended Next Steps / Topics
- Ask me to turn this into a **shorter, cleaner developer brief**.
- Ask me to create the **exact database schema and entity list** next.
- Ask me to write the **full sitemap and page-by-page UX specification**.
- Ask me to produce a **backend module/API specification** for the developer.
- Ask me to rewrite this as a **formal PRD in English** for handoff.