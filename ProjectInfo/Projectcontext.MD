# FreshVana Organic Marketplace — Project Context & Reference Guide

This document maintains the complete architecture, API specs, authentication flows, environment settings, and development standards for the **FreshVana Frontend Application**. Update this file whenever new features, routes, or API integrations are introduced.

---

## 1. Executive Overview & Tech Stack

- **Framework**: Next.js (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict mode)
- **Styling**: Vanilla CSS + Bootstrap 5 + Framer Motion (micro-animations & smooth transitions)
- **State Management**:
  - **Redux Toolkit**: Centralized store (`auth`, `cart`, `catalog`) located at [`src/store/index.ts`](file:///f:/Projects/Fresh_Food_website/src/store/index.ts)
  - **React Context**: High-level wrappers (`AuthContext`, `CartContext`) located in [`src/context/`](file:///f:/Projects/Fresh_Food_website/src/context/)
- **API Architecture**: Centralized `fetch`-based HTTP client matching OpenAPI 3.1 specification ([`docs/OpenAPISpecs.yaml`](file:///f:/Projects/Fresh_Food_website/docs/OpenAPISpecs.yaml)).

---

## 2. Directory Structure

```
Fresh_Food_website/
├── docs/
│   └── OpenAPISpecs.yaml       # Authoritative OpenAPI 3.1 contract
├── ProjectInfo/
│   └── Projectcontext.MD       # Maintained project context reference
├── public/
│   └── images/                 # Cutouts, produce graphics & banners
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── account/            # User profile & saved address book
│   │   ├── admin/              # Admin dashboard (products, categories, vendor listings)
│   │   ├── cart/               # Shopping basket page
│   │   ├── checkout/           # Multi-step checkout & slot selection
│   │   ├── login/              # Auth page (Login / Register / Quick Autofill)
│   │   ├── orders/             # Order history & live delivery tracking
│   │   ├── product/[id]/       # Product detail page
│   │   ├── shop/               # Store catalog with filters & search
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable UI components (Navbar, Footer, ProductCards)
│   ├── context/                # AuthContext & CartContext
│   ├── data/                   # Initial local mock datasets (products, categories)
│   ├── services/
│   │   └── api.ts              # Centralized API service & endpoint modules
│   ├── store/                  # Redux Toolkit store & slices (auth, cart, catalog)
│   ├── styles/                 # Global styling & layout CSS
│   └── types/
│       └── index.ts            # TypeScript interfaces for API & UI entities
├── .env                        # Local environment variables
├── .env.example                # Environment variable template
└── tsconfig.json               # TypeScript configuration
```

---

## 3. Environment Variables

Defined in [`.env`](file:///f:/Projects/Fresh_Food_website/.env) and [`.env.example`](file:///f:/Projects/Fresh_Food_website/.env.example):

| Variable | Description | Default Value |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base HTTP URL for MarketPlace Backend API | `http://localhost:4000` |
| `NEXT_PUBLIC_APP_NAME` | Frontend Application Title | `FreshVana Organic Marketplace` |
| `NEXT_PUBLIC_APP_URL` | Frontend Web Host URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPPORT_PHONE` | Customer WhatsApp/Support Phone Number | `918707375679` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Customer Support Email | `support@freshvana.com` |
| `NEXT_PUBLIC_ENABLE_MOCK_FALLBACK` | Toggle local mock fallback when backend server is offline | `true` |

---

## 4. API Service & OpenAPI Integration

All backend communications are routed through [`src/services/api.ts`](file:///f:/Projects/Fresh_Food_website/src/services/api.ts). It injects JWT authorization headers automatically (`Authorization: Bearer <accessToken>`) and formats standard envelopes (`{ success, data, message, error }`).

### Implemented API Modules:

1. **`healthApi`**: Service health probes (`/health`, `/health/ready`).
2. **`authApi`**:
   - `signup(payload)` -> `POST /api/v1/auth/signup`
   - `login(payload)` -> `POST /api/v1/auth/login`
   - `refresh(refreshToken)` -> `POST /api/v1/auth/refresh`
   - `logout(refreshToken)` -> `POST /api/v1/auth/logout`
   - `logoutAll()` -> `POST /api/v1/auth/logout-all`
   - `getCurrentUser()` -> `GET /api/v1/auth/me`
   - `verifyEmail(token)` -> `GET /api/v1/auth/verify-email`
   - `resendVerification(userId)` -> `POST /api/v1/auth/resend-verification`
   - `forgotPassword(email)` -> `POST /api/v1/auth/forgot-password`
   - `resetPassword(token, newPassword)` -> `POST /api/v1/auth/reset-password`
3. **`usersApi`**: User profile & saved addresses (`/api/v1/users/me`, `/api/v1/users/addresses`, `/default`).
4. **`deliveryApi`**: Pincode zone lookup (`/api/v1/delivery/zones`) & real-time slot capacity (`/api/v1/delivery/slots`).
5. **`catalogApi`**: Public catalog read operations (`/api/v1/catalog/public/*`) & Admin catalog CRUD.
6. **`vendorApi`**: Vendor product management (`/api/v1/vendor/products`) & inventory quantity adjustments (`/api/v1/vendor/inventory`).
7. **`cartApi`**: Cart operations (`/api/v1/cart`, `/items`, `/sync`).
8. **`checkoutApi`**: Idempotent order placement (`POST /api/v1/checkout`).
9. **`ordersApi`**: Customer and Vendor order details & status updates (`/api/v1/orders/customer`, `/api/v1/orders/vendor`).
10. **`couponsApi`**: Admin promotional coupon management (`/api/v1/admin/coupons`).
11. **`referralsApi`**: Admin referral tracking & reward distribution (`/api/v1/admin/referrals`).
12. **`adminApi`**: Vendor onboarding approvals, permissions list, role CRUD & user role assignments (`/api/v1/admin/*`).

---

## 5. Authentication & Security Policy

- **Token Storage**: JWT access token stored in `localStorage` under `freshvana_access_token`, refresh token under `freshvana_refresh_token`.
- **Strict Credential Validation**:
  - If backend returns an authentication error (HTTP 400/401/403), login is **immediately rejected** with user notification.
  - If backend is offline/unreachable, demo mode login ONLY succeeds if credentials match configured demo accounts (`DEFAULT_USERS`) **AND** password matches (`existing.password === inputPass`).
  - Entering invalid passwords or non-demo credentials when offline returns explicit error messages.

---

## 6. Developer Guidelines for Future Reference

1. **Adding New API Endpoints**:
   - Update `docs/OpenAPISpecs.yaml` if schema changes.
   - Add method in `src/services/api.ts` under appropriate module namespace.
   - Declare TypeScript interfaces in `src/types/index.ts`.
   - Update this file (`ProjectInfo/Projectcontext.MD`).
2. **Type Safety & Build Checks**:
   - Run `npx tsc --noEmit` before committing code changes.
   - Run `npm run build` to verify Next.js static/SSR page compilation.
