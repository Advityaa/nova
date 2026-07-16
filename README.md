# Nova Events

Shanghai nightlife & events site — Next.js 14 (App Router) + TypeScript + Tailwind, with content served from **Vercel Postgres**.

## Database setup (Vercel Postgres)

1. **Create the database.** In the Vercel dashboard → Storage → create a **Postgres** store, and connect it to this project. Vercel injects `POSTGRES_URL` (and friends) automatically on deploys.

2. **Local env.** Copy the store's credentials into a local env file:
   ```bash
   cp .env.example .env.local
   # paste the values from the Postgres store's ".env.local" tab
   ```
   `.env.local` is git-ignored — never commit secrets.

3. **Create the schema, then seed** the nova.html content:
   ```bash
   npm run db:migrate   # applies db/schema.sql
   npm run db:seed      # inserts events, ticket tiers, gallery images
   # or both at once:
   npm run db:reset
   ```

4. **Run it:**
   ```bash
   npm run dev
   ```

The home page and event pages read live from the DB (`export const dynamic = "force-dynamic"`), so **editing a row in the Vercel Postgres data editor changes the site on the next reload** — no redeploy. Swap to `export const revalidate = 30` in `app/page.tsx` / `app/events/[slug]/page.tsx` for ISR caching instead.

## Data model

See [`db/schema.sql`](db/schema.sql). Notes:

- **Money is integer `fen`** (RMB cents) in `ticket_tiers.price_fen`; the UI formats to `¥` (`fenToYuan` in `lib/db.ts`). No floats.
- `events.status` is the lifecycle enum (`draft` / `onsale` / `soldout` / `past`); on-sale events become the "This week" cards.
- Three columns extend the prescribed schema so the site renders **identically** to the prototype: `accent_ink` (drawer/hero accent-ink), `weekday` (the source labels aren't calendar-consistent), and `status_label` (the exact marketing badge, e.g. "Selling fast"). The card date `DD.MM` is derived from `starts_at`.
- **Storage:** `event-images` / `gallery` map to **Vercel Blob** (set `BLOB_READ_WRITE_TOKEN`). Images are currently served from `public/`; upload wiring lands with the dashboard stage.

## Admin auth (Auth.js v5)

Email + password login for the team, gating `/admin/*`. Users live in the `users` table (bcrypt-hashed passwords).

> **ORM note:** Stage 2 uses raw `@vercel/postgres` (no Drizzle/Prisma). The **Credentials** provider requires **JWT sessions**, so the database *adapter* (which only powers OAuth / DB sessions) isn't used — `authorize()` verifies the password against the DB with bcrypt. This is the standard v5 Credentials pattern and stays consistent with the raw-SQL layer.

### Setup

1. Add an auth secret to `.env.local`:
   ```bash
   echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
   ```
2. Migrate (adds the `users` table) and seed the owner:
   ```bash
   npm run db:migrate
   # set OWNER_EMAIL / OWNER_PASSWORD in .env.local, then:
   npm run user:seed-owner
   ```
   Add more admins later: `npm run user:create -- --email a@b.com --password 'pw' --role admin --name "Jo"`
   Need a hash by hand? `npm run hash -- 'the-password'`

3. `npm run dev`, visit `/login`, sign in → `/admin`.

### How it's protected (server-side, two layers)

- **[middleware.ts](middleware.ts)** (Edge) gates `/admin/:path*` via [auth.config.ts](auth.config.ts) — logged-out requests 307-redirect to `/login`.
- **[app/(dashboard)/admin/layout.tsx](app/(dashboard)/admin/layout.tsx)** re-checks `await auth()` server-side and redirects if there's no session.

The config is split so bcrypt/DB stay out of the Edge runtime: `auth.config.ts` (edge-safe, used by middleware) vs [auth.ts](auth.ts) (Node — Credentials + bcrypt + DB). Roles (`owner` / `admin`) ride in the JWT and are exposed on `session.user`.

## Checkout (mock mode — no real payments)

The order pipeline is real; the payment provider is mocked. Flow:

1. **TicketDrawer** / event page → pick tiers + name/email → **Checkout**.
2. `POST /api/checkout` creates a `pending` order + `order_items` (amount is **priced server-side from the DB** — client prices are ignored), then calls `provider.createCheckout(...)` and returns a `redirectUrl`.
3. The browser follows `redirectUrl` to the mock gateway callback (`/api/payments/mock/callback`), which **verifies server-side** and calls `markOrderPaid(...)` — the order is *only* marked paid on this path, never by client redirect. `sold` is incremented per tier atomically and idempotently (a replayed callback is a no-op).
4. It then redirects to **`/checkout/confirmation?order=…`** — order summary + a QR ticket of the order id.

### Swapping in a real provider later

Everything lives behind [`lib/payments/index.ts`](lib/payments/index.ts) (`PaymentProvider` interface + `getProvider()`). To add a real gateway:

1. Add `lib/payments/<name>.ts` implementing `PaymentProvider`.
2. Add a `case "<name>":` in `getProvider()`.
3. Set `PAYMENT_PROVIDER=<name>` in env.

No route or UI code changes — the app only ever calls `getProvider()`. Confirmation emails are stubbed in [`lib/email.ts`](lib/email.ts) (TODO: Resend).

## Contact form

`components/ContactForm.tsx` calls the `submitEnquiry` server action (`app/actions.ts`), which inserts into `enquiries`, then opens WhatsApp pre-filled — same UX as before.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `start` | Production build / serve |
| `npm run db:migrate` | Apply `db/schema.sql` |
| `npm run db:seed` | Seed events, tiers, gallery |
| `npm run db:reset` | Migrate + seed |
