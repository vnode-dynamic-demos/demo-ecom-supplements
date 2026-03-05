# Admin Portal — IP Whitelisting & Security Guide

> **Key principle:** Only `/admin/*` routes are restricted. All customer-facing pages (`/`, `/products`, `/checkout`, etc.) remain 100% publicly accessible — no VPN needed for shoppers.

---

## How It Works

```
Public internet
     │
     ├─► /products, /checkout, /account  → ✅ Open to everyone
     │
     └─► /admin/*  → 🔒 Blocked unless IP is whitelisted
                         (your office IP or VPN IP)
```

---

## Option A — Next.js Middleware (No External Tool Needed)

This blocks `/admin` **at the application level** — works on any host (Vercel, Firebase, VPS).

### Step 1 — Create `middleware.ts` in project root

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// ── Add your allowed IPs here ──────────────────────────────────────────────
// Your office static IP, VPN exit IP, etc.
const ALLOWED_IPS = [
  '203.0.113.10',    // e.g. Your office static IP
  '198.51.100.25',   // e.g. VPN exit node IP
  '127.0.0.1',       // localhost (dev)
  '::1',             // localhost IPv6 (dev)
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next(); // Public routes — allow all
  }

  // Allow the login page to be accessible (so admins can see a proper error)
  // Remove this if you want a hard block even on /admin/login
  // if (pathname === '/admin/login') return NextResponse.next();

  // Get client IP
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0';

  if (ALLOWED_IPS.includes(ip)) {
    return NextResponse.next(); // ✅ Allowed
  }

  // ❌ Blocked — return 403 or redirect
  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:4rem">
      <h1>403 — Access Denied</h1>
      <p>Admin access is restricted to authorized IPs only.</p>
      <a href="/">← Back to Store</a>
    </body></html>`,
    { status: 403, headers: { 'Content-Type': 'text/html' } }
  );
}

export const config = {
  matcher: ['/admin/:path*'], // Only run middleware on /admin routes
};
```

### Step 2 — Find Your IP to Whitelist

```bash
# Your current public IP:
curl ifconfig.me

# Or visit: https://whatismyipaddress.com
```

> ⚠️ **Home/4G IPs change regularly.** Use a static IP (from your ISP — costs ~₹500/mo) or a VPN with a fixed exit IP.

### Step 3 — Add IP to ALLOWED_IPS array

```typescript
const ALLOWED_IPS = [
  '203.0.113.10',  // ← Replace with your actual static IP or VPN IP
];
```

---

## Option B — Cloudflare WAF Rules (Recommended for Production)

Cloudflare sits in front of your server and blocks requests **before they even reach Next.js**. More robust, easier to manage, no code changes needed.

### Prerequisites
- Your domain's DNS managed by Cloudflare (free plan works)
- Domain proxied through Cloudflare (orange cloud ☁️ icon)

### Step 1 — Add your domain to Cloudflare

1. [cloudflare.com](https://cloudflare.com) → **Add a site** → Enter your domain
2. Change your domain's nameservers to Cloudflare's (in your domain registrar)
3. Enable **Proxy** (orange cloud) on your DNS A/CNAME records

### Step 2 — Create a WAF Rule

1. Cloudflare Dashboard → **Security → WAF → Custom Rules → Create rule**
2. Fill in:

| Field | Value |
|---|---|
| Rule name | `Block Admin — Non-Whitelisted IPs` |
| **If...** (Expression) | See below |
| **Then...** | Block |

**Expression (paste this):**
```
(http.request.uri.path contains "/admin") and not (ip.src in {203.0.113.10 198.51.100.25})
```

Replace the IPs with your actual IPs. Add more separated by spaces.

3. Click **Deploy**

> ✅ Customers visiting `/products`, `/checkout` etc. are completely unaffected — Cloudflare only blocks paths containing `/admin`.

### Step 3 — Add Your IP(s)

- **Static office IP:** Contact your ISP for a static IP (~₹300–600/mo for business broadband)
- **VPN with fixed IP:** See VPN Options below

### Optional — Cloudflare Zero Trust (Free for ≤50 users)

A more flexible option — admins log in with Google/email via Cloudflare's portal before reaching `/admin`:

1. Cloudflare Dashboard → **Zero Trust → Access → Applications → Add an application**
2. Type: **Self-hosted**
3. Path: `yourdomain.com/admin`
4. Policy: Allow users with `@yourcompany.com` Google accounts

No VPN needed — admins just authenticate via Google/email through Cloudflare.

---

## Option C — Vercel IP Rules (`vercel.json`)

If you're deploying to Vercel, you can add firewall rules directly in `vercel.json`.

> ⚠️ Vercel Firewall is available on **Pro plan** ($20/mo) and above.

```json
{
  "firewall": {
    "rules": [
      {
        "name": "Block admin — non-whitelisted IPs",
        "active": true,
        "conditionGroup": [
          {
            "conditions": [
              {
                "type": "path",
                "op":   "pre",
                "value": "/admin"
              },
              {
                "type": "ip_address",
                "op":   "nin",
                "value": ["203.0.113.10", "198.51.100.25"]
              }
            ]
          }
        ],
        "action": {
          "mitigate": {
            "action": "deny",
            "rateLimit": null,
            "redirect": null,
            "actionDuration": null
          }
        }
      }
    ]
  }
}
```

Alternatively via the Vercel Dashboard:  
**Project → Security → Firewall → Create Rule → Path starts with `/admin` AND IP not in list → Block**

---

## VPN Options (Fixed Exit IP)

If your team doesn't have a static office IP, a business VPN gives everyone a **fixed exit IP** to whitelist.

| VPN | Fixed IP | Price | Best For |
|-----|----------|-------|----------|
| **NordVPN Teams** | ✅ Dedicated IP | ~$7/user/mo | Small teams |
| **Tailscale** | ✅ (private network) | Free for ≤3 users | Developers |
| **Cloudflare WARP** | Via Zero Trust | Free | Best with Cloudflare setup |
| **AWS Client VPN** | ✅ via NAT Gateway | ~$5–10/mo | Tech teams |

### Recommended: Tailscale (Free, Dev-Friendly)

Tailscale creates a private overlay network. Your device appears as `100.x.x.x`. Whitelist that range for admin access.

```bash
# Install Tailscale on admin's machine
# https://tailscale.com/download

# Then whitelist the Tailscale subnet:
const ALLOWED_IPS = [
  '100.0.0.0/8',  // Tailscale subnet — all your team devices
];
```

---

## Option D — Tailscale (Detailed Setup Guide)

### What is Tailscale?

Tailscale is a **zero-config private VPN** built on WireGuard. Instead of routing all your internet traffic through a VPN server (like NordVPN does), Tailscale just creates a secure **private network between your approved devices**.

```
Your Laptop  ──── Tailscale Network (100.x.x.x) ────  Your Server
Your Phone   ────         (encrypted)            ────  Teammate's Laptop
```

- Every device on your Tailscale account gets a **fixed private IP in the 100.x.x.x range**
- These IPs never change, even if your home/4G public IP changes
- No subscription cost for up to 3 users, no hardware, no configuration file

**Why it's great for admin access:** You whitelist `100.0.0.0/8` once. Every device your team adds to Tailscale will automatically be allowed — you never have to update IP lists again.

---

### Step 1 — Create a Free Tailscale Account

1. Go to [tailscale.com](https://tailscale.com) → Click **Get Started Free**
2. Sign in with **Google or GitHub** (no new password needed)
3. You now have a Tailscale account. Each device you add is an "endpoint"

---

### Step 2 — Install Tailscale on Your Admin Machine(s)

**Windows:**
```
https://tailscale.com/download/windows
```
Download the installer, run it, sign in with your Google/GitHub account.

**macOS:**
Available on the Mac App Store, or:
```bash
brew install tailscale
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

**Android / iOS:**
Install from Play Store / App Store → Search "Tailscale" → Sign in.

> Once signed in on any device, it immediately joins your private network with a `100.x.x.x` address.

---

### Step 3 — Update middleware.ts

> 💡 **You have two approaches. Pick one.**

---

#### 🟢 Approach A — No IP needed (Recommended)

This is the **zero-knowledge approach**. You do NOT need to know anyone's IP address. You only write one line of logic: "if the IP starts with `100.`, it's a Tailscale device on my account — allow it."

All Tailscale IPs globally are in the `100.64.0.0 – 100.127.255.255` range and are assigned only to **authenticated Tailscale users on your account**. No random person on the internet will ever have a `100.x.x.x` IP.

```typescript
// middleware.ts — paste this function, no IPs to fill in
function isAllowed(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === '::1') return true; // always allow localhost
  if (ip.startsWith('100.')) return true;              // any Tailscale device on your account
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0';

  if (isAllowed(ip)) return NextResponse.next(); // ✅ Tailscale device

  return new NextResponse('403 — Access Denied', { status: 403 });
}

export const config = { matcher: ['/admin/:path*'] };
```

**That's it.** No IPs, no secrets, no environment variables. Anyone who installs Tailscale and is approved on your account will have `/admin` access automatically.

---

#### 🔵 Approach B — Specific Tailscale device IPs (optional, more restrictive)

Use this ONLY if you want to limit access to specific machines even within your Tailscale account (e.g. only your work laptop, not your phone).

For this you DO need to look up each device's Tailscale IP **once** (it never changes after that):

```bash
# On that specific machine, after installing Tailscale:
tailscale ip -4
# Output: 100.72.45.12   ← use this value below
```

Or check all devices at [login.tailscale.com](https://login.tailscale.com) → **Machines** tab.

```typescript
// middleware.ts
const ALLOWED_IPS = [
  '100.72.45.12',  // Work laptop (found via: tailscale ip -4)
  '100.88.12.34',  // Teammate's laptop
  '127.0.0.1',
  '::1',
];
// Use: if (ALLOWED_IPS.includes(ip)) return NextResponse.next();
```

> Note: unlike your home/4G IP (which changes), Tailscale IPs are **permanent** — you find each device's IP once and never need to update it again.

Update your middleware to use the `isAllowed` function:

```typescript
// In your middleware function, replace:
//   if (ALLOWED_IPS.includes(ip)) {
// With:
//   if (isAllowed(ip)) {

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0';

  if (isAllowed(ip)) return NextResponse.next();

  return new NextResponse('403 Forbidden', { status: 403 });
}
```

---

### Step 5 — Add Teammates (Optional)

1. Have your teammate install Tailscale on their machine
2. They sign in with **their own Google/GitHub account**
3. In your Tailscale Admin Console → **Users → Invite** → enter their email

They appear in the **Machines** list with their own `100.x.x.x` IP. If used with Option 2 (entire subnet), they automatically have `/admin` access. If using Option 1, add their IP to `ALLOWED_IPS`.

---

### How It Looks in Practice

```
WITHOUT Tailscale:
  You at home (dynamic IP: 49.36.x.x) → /admin → ❌ BLOCKED

WITH Tailscale running on your laptop:
  You at home → Tailscale encrypts → you appear as 100.72.45.12 → /admin → ✅ ALLOWED

You on 4G in a café:
  Same thing — Tailscale IP is always 100.72.45.12 regardless of your real IP
```

---

### Cost & Limits

| Plan | Users | Devices | Price |
|------|-------|---------|-------|
| **Personal (Free)** | 1 user | Up to 100 devices | Free forever |
| **Starter** | Up to 3 users | Up to 100 devices | Free forever |
| **Business** | Unlimited users | Unlimited | $6/user/mo |

For a solo developer or 2–3 person team managing one store, **the free plan is more than enough**.

---

## Which Option to Choose?

| Scenario | Recommendation |
|---|---|
| Just starting out (free) | **Option A** — Next.js middleware |
| Domain on Cloudflare | **Option B** — Cloudflare WAF (most robust) |
| Deploying to Vercel Pro | **Option C** — Vercel Firewall rules |
| Team spread across locations | **Cloudflare Zero Trust** (Google login auth) |
| Developers only | **Tailscale** — no static IP needed |

---

## Security Checklist

- [ ] At least one IP whitelist method enabled
- [ ] Admin password changed from default `admin/vnode@admin`
- [ ] Supabase service key only in server-side code
- [ ] Rate-limiting enabled on `/admin/login` (Cloudflare or Next.js)
- [ ] Admin login connects to Supabase Auth (not localStorage session)
- [ ] HTTPS enforced (automatic on Vercel/Firebase/Cloudflare)
