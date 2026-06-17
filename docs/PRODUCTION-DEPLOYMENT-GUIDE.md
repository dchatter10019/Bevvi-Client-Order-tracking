# Bevvi Order Monitor — Production Deployment Guide

**Version:** 1.0.1  
**Last updated:** June 2026

This document explains how to deploy the Order Monitor Dashboard as a **single codebase** serving multiple white-labeled customer sites via custom URLs.

---

## Table of contents

1. [Overview](#overview)
2. [Production URLs](#production-urls)
3. [Architecture](#architecture)
4. [DNS setup](#dns-setup)
5. [Build and deploy](#build-and-deploy)
6. [API server](#api-server)
7. [Adding a new customer](#adding-a-new-customer)
8. [Local development](#local-development)
9. [Environment variables](#environment-variables)
10. [Checklist](#checklist)

---

## Overview

The Order Monitor is a React + Vite frontend with a small Node.js API proxy. **One build** serves every customer. The active brand is chosen automatically from the **hostname** in the browser URL.

| Concept | Description |
|---|---|
| **Hub site** | Internal URL where all customers are visible and switchable |
| **White-label site** | Customer-specific URL locked to one brand (no dropdown) |
| **Customer config** | Markdown file in `customers/*.md` (branding, API client id, hostname) |

You do **not** need separate repos, forks, or per-customer builds for normal operation.

---

## Production URLs

| URL | Customer | Purpose |
|---|---|---|
| `https://ordertracker.getbevvi.com` | All | Internal hub — customer switcher in sidebar |
| `https://ac-ordertracker.getbevvi.com` | Air Culinaire | White-label |
| `https://island-ordertracker.getbevvi.com` | Island Kitchen | White-label |
| `https://netjets-ordertracker.getbevvi.com` | NetJets | White-label |

**Default pattern** (if no custom hostname is set in config):

```
https://<customer-id>.ordertracker.getbevvi.com
```

Custom hostnames are defined per customer in `customers/<id>.md`:

```markdown
## Monitor Settings

- id: airculinaire
- hostname: ac-ordertracker.getbevvi.com
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  User browser                                                   │
│  https://island-ordertracker.getbevvi.com                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  CDN / static host (S3, CloudFront, Netlify, etc.)              │
│  Serves: dist/index.html + JS/CSS assets (one shared build)     │
│  SPA fallback: all routes → index.html                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
         App reads hostname → loads Island Kitchen theme
         (from customers/islandkitchen.md bundled at build time)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GET /api/orders?client=islandkitchen&numofdays=30              │
│  (same origin or configured API host)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Node API proxy (server.js)                                     │
│  Proxies to Bevvi API                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  https://api.getbevvi.com/api/corputil/getOrderHistory          │
└─────────────────────────────────────────────────────────────────┘
```

**Hostname resolution order:**

1. Exact match on `- hostname:` in customer markdown
2. Default pattern `<id>.ordertracker.getbevvi.com`
3. Hub hostname `ordertracker.getbevvi.com` → all customers, switchable
4. Local dev fallback: `VITE_CUSTOMER` in `.env.local` (optional)

---

## DNS setup

Point **each hostname** to the same hosting origin (CDN or load balancer).

Example DNS records:

| Type | Name | Value |
|---|---|---|
| CNAME | `ordertracker` | `your-cdn.cloudfront.net` |
| CNAME | `ac-ordertracker` | `your-cdn.cloudfront.net` |
| CNAME | `island-ordertracker` | `your-cdn.cloudfront.net` |
| CNAME | `netjets-ordertracker` | `your-cdn.cloudfront.net` |

**Requirements:**

- HTTPS/TLS certificate must cover all hostnames (multi-SAN or wildcard)
- All hostnames serve the **same** static files (one `dist/` deployment)

---

## Build and deploy

### Build

```bash
npm install
npm run build
```

Output: `dist/` folder (static HTML, JS, CSS).

During build, all `customers/*.md` files are bundled into the JavaScript. Adding a customer requires a **redeploy** of this build, but not a separate build per customer.

### Deploy static frontend

Upload `dist/` to your static host. Configure:

1. **SPA routing** — return `index.html` for unknown paths (required for React Router)
2. **Cache** — long cache for `/assets/*`, short or no cache for `index.html`
3. **HTTPS** — enforce TLS on all customer hostnames

### Deploy API proxy

The frontend calls `/api/orders` on the same origin in development (Vite proxies to port 3001). In production, choose one of:

**Option A — Same domain (recommended)**  
Configure your CDN/reverse proxy so `/api/*` forwards to the Node server:

```
https://island-ordertracker.getbevvi.com/api/orders
  → Node server (server.js) on port 3001 or container
```

**Option B — Separate API subdomain**  
Host the API at e.g. `api-ordertracker.getbevvi.com` and update the frontend fetch base URL (requires a small code or env change for production API URL).

---

## API server

Run the Node proxy in production:

```bash
npm run server
```

Default port: **3001**

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | API listen port |
| `BEVVI_API_BASE_URL` | `https://api.getbevvi.com` | Upstream Bevvi API |
| `CORS_ORIGIN` | `http://localhost:3002` | Allowed frontend origin (set to production URL in prod) |

**Upstream endpoint:**

```
GET {BEVVI_API_BASE_URL}/api/corputil/getOrderHistory
    ?client=<customerId>
    &numofdays=<days>
```

The `client` parameter matches the `id` field in each customer's markdown config (e.g. `airculinaire`, `islandkitchen`, `netjets`).

**Health check:**

```
GET /api/health
→ { "status": "ok", "service": "order-monitor-dashboard" }
```

---

## Adding a new customer

1. **Create config file**  
   Add `customers/<id>.md` with the design system plus operational sections:

   ```markdown
   ## Monitor Settings

   - id: newcustomer
   - label: New Customer Name
   - hostname: newcustomer-ordertracker.getbevvi.com
   - tagline: Your tagline here.
   - logo: /logos/newcustomer.png
   - favicon: /favicons/newcustomer.png
   - primary: #hex
   - sidebar: #hex
   - canvas: #hex
   - font-body: Inter
   - font-display: Playfair Display

   ## Order Statuses
   - 0: Pending
   ...

   ## Status Pipeline
   - Pending
   - Accepted
   ...
   ```

2. **Add assets**  
   Place logo and favicon under `public/` (paths referenced in config).

3. **Verify API client id**  
   Confirm `id` matches the Bevvi API `client` parameter for that customer.

4. **Build and deploy**  
   Run `npm run build` and deploy the updated `dist/`.

5. **DNS**  
   Create a CNAME for the `- hostname:` value pointing to your CDN.

See also: `customers/README.md` for config format details.

---

## Local development

### Start servers

```bash
# Terminal 1 — API
npm run server

# Terminal 2 — Frontend
npm run dev
```

- Frontend: **http://localhost:3002**
- API: **http://localhost:3001**

### Choose a customer locally

```bash
npm run customer
```

- **Option 0** — All customers (switchable dropdown)
- **Option 1+** — Lock to one brand (writes `VITE_CUSTOMER` to `.env.local`)

### Test production-style hostnames locally

Add to `/etc/hosts`:

```
127.0.0.1 ordertracker.getbevvi.com
127.0.0.1 ac-ordertracker.getbevvi.com
127.0.0.1 island-ordertracker.getbevvi.com
127.0.0.1 netjets-ordertracker.getbevvi.com
```

Then open e.g. `http://island-ordertracker.getbevvi.com:3002`

### Login (all environments)

Credentials are defined in `src/utils/constants.js` (shared across all skins).

---

## Environment variables

### API server (`.env` or host env)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API port (default 3001) |
| `BEVVI_API_BASE_URL` | No | Bevvi API base URL |
| `CORS_ORIGIN` | Yes in prod | Frontend URL allowed by CORS |

### Frontend build (`.env.local` — local dev only)

| Variable | Required | Description |
|---|---|---|
| `VITE_CUSTOMER` | No | Lock local dev to one customer id |
| `VITE_CUSTOMER_HOST_SUFFIX` | No | Override default domain suffix |

**Note:** `VITE_CUSTOMER` is **not** used in production white-label deploys. Production uses hostname routing.

---

## Checklist

### First production launch

- [ ] Build passes: `npm run build`
- [ ] `dist/` deployed to CDN/static host
- [ ] SPA fallback configured
- [ ] TLS certificates for all hostnames
- [ ] DNS CNAMEs for hub + each white-label hostname
- [ ] API proxy running and reachable at `/api`
- [ ] `CORS_ORIGIN` set to production frontend URL(s)
- [ ] Smoke test each URL loads correct brand
- [ ] Smoke test orders load for each `client` id

### Adding a customer later

- [ ] `customers/<id>.md` created with `hostname`, `id`, branding
- [ ] Logo/favicon in `public/`
- [ ] API returns orders for `client=<id>`
- [ ] Rebuild and redeploy shared `dist/`
- [ ] DNS record for new hostname

---

## Quick reference

| Task | Command / location |
|---|---|
| Build | `npm run build` |
| Run API locally | `npm run server` |
| Run frontend locally | `npm run dev` |
| Pick local customer | `npm run customer` |
| Customer configs | `customers/*.md` |
| Hostname logic | `src/customers/resolveCustomerHost.js` |
| API proxy code | `server.js` |

---

## Support

Repository: Bevvi Client Order tracking  
For config examples, see `customers/airculinaire.md`, `customers/islandkitchen.md`, and `customers/netjets.md`.
