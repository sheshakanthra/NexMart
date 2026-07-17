# NexMart — Hyperlocal Commerce Operating System (Frontend-Only)

## Problem Statement
Build a full multi-module frontend for **NexMart**, a Hyperlocal Commerce OS for Chennai's neighborhood kirana stores. Three-sided marketplace:
- **Customers** discover and buy from stores near them with live stock visibility.
- **Vendors** manage inventory and orders through a real-time command dashboard with an AI copilot named **Sentinel**.
- **Admins** oversee marketplace health, vendor approvals, and city-wide demand.

No backend, no APIs, no real auth — everything mocked.

## Tech Stack
- **React 18** + React Router v6
- **Tailwind CSS** with CSS-variable-driven theme system (dark + light)
- **Recharts** for all dashboard visualisations
- **framer-motion** for entrance animations
- **react-fast-marquee** for live tickers
- **lucide-react** icons
- Mock data + `useReducer` context + `localStorage` persistence
- Realtime simulated via `setInterval` in `AppContext`

## Architecture (5 Layers)
1. **Presentation** — React Router modules (`/`, `/architecture`, `/auth`, `/customer/*`, `/vendor/*`, `/admin/*`, `/*` → 404)
2. **State & Data** — `AppContext` reducer, localStorage for cart / wishlist / theme / profile / session
3. **Realtime Sync** — single interval loop simulates stock ticks, order progression, notifications, simulator-driven order generation
4. **AI Layer (Sentinel)** — mock insights: daily brief, restock suggestions, keyword-matched chat
5. **Visualization** — Recharts + custom SVG sparklines + CSS heatmap grid

## Modules Implemented (All Pages)
### Public
- Landing (hero with live counters, role cards, showcase, footer)
- Architecture (5-layer overview + route map)
- 404

### Auth
- Login / Signup with validation
- One-tap `Explore as: Customer / Vendor / Admin`

### Customer (12 pages)
Home · Nearby Stores (list/map) · Store Details · Product Details (live stock meter + Notify Me) · Search (regular + Natural-Language) · Cart · Checkout (COD + simulated UPI + stock-conflict dialog) · Order Success · Orders History · Order Tracking (5-stage timeline) · Profile (addresses/theme/logout) · Wishlist

### Vendor (9 pages)
Dashboard (KPIs + hourly chart + top products + Sentinel headline + incoming orders + low-stock alerts) · Orders (5-stage board) · Inventory (searchable/filterable table with inline steppers + sparklines) · Add Product (with mock AI description) · Edit Product (danger zone) · Analytics (revenue, category, peak-hour grid, demand forecast) · Sentinel AI (daily brief + restock suggestions + chat) · Store Profile (radius, hours, open/closed) · Settings

### Admin (9 pages)
Executive Dashboard (5 KPIs + live ticker + GMV + category + hourly + leaderboard + neighborhood trends + demand preview) · Live Order Stream (pause/filter/clear) · Demand Map (zone heat + drill-down) · Vendor Management (sortable table + detail drawer + suspend) · Vendor Approval (approve/reject with reason) · Inventory Health (critical items + category availability) · Platform Analytics (funnel, growth, fulfillment, categories) · Simulator (start/stop + intensity + affects live feeds) · Settings

## Realtime Features
- Stock quantities tick down on customer/vendor screens (`useEffect` interval)
- Order timeline auto-progresses through stages
- Vendor Dashboard KPIs update live (with `CountUp`)
- Admin ticker + Live Stream continuously updated
- Simulator toggle **actually generates** new orders across the platform
- Notification bell with unread badge + toaster

## Design System
- **Brand**: Saffron Orange `#EA580C`
- **Typography**: Cabinet Grotesk (headings) + IBM Plex Sans (body) + JetBrains Mono (metrics)
- **Aesthetic**: "Bazaar meets Command Center" — high-contrast dark OS surface with 1px borders, grid backgrounds, glassmorphism headers, and Sentinel indigo `#6366F1` accent for AI surfaces
- **Every page** has loading/empty/error states, responsive to mobile/tablet/desktop
- **data-testid** on every interactive element for testability

## Test Status
- **Frontend**: 100% (18/18 flows verified by testing agent on iteration 1)
- **Backend**: N/A (mock-only frontend)
- No UI bugs, no integration issues.

## What's Been Implemented (Jan 2026)
- ✅ Full landing + architecture + auth
- ✅ Full customer module (12 pages, cart persistence, natural-language search)
- ✅ Full vendor module (9 pages, Sentinel AI, live board, analytics)
- ✅ Full admin module (9 pages, demand map, simulator, live stream)
- ✅ Realtime simulation (stock, orders, ticker)
- ✅ Theme system (dark/light with persistence)
- ✅ Toaster + notification center
- ✅ 100% responsive

## Backlog / Future
- **P2** Real backend + auth (currently mocked)
- **P2** WebSocket-driven live stream (currently interval-driven mock)
- **P2** Real map integration (Leaflet / Mapbox) for Demand Map + Nearby Stores map view
- **P2** Real AI for Sentinel (LLM integration)
- **P2** Payment gateway integration (Stripe/Razorpay/UPI)
- **P3** Image upload service + CDN

## Next Tasks (When Resumed)
1. Awaiting user feedback on the initial delivery
2. Any specific customization to design or copy
3. Potential business enhancement: turn the "Explore as" one-tap into a public product-tour that captures leads (email) before entering the demo — highest-signal top-of-funnel conversion mechanism for a B2B2C marketplace like this.
