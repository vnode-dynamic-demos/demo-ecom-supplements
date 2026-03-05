import { NextRequest, NextResponse } from 'next/server';

// ─── HOW TO CONFIGURE ──────────────────────────────────────────────────────────
//
// Option A — Add IPs via Vercel env var (no redeploy needed):
//   Vercel Dashboard → Project → Settings → Environment Variables
//   Add: ALLOWED_ADMIN_IPS = 203.0.113.10,198.51.100.25
//   Comma-separated, no spaces. Redeploy once after adding the var.
//
// Option B — Tailscale (zero IP management):
//   Install Tailscale on your machine → all 100.x.x.x IPs are auto-allowed.
//   No env var needed — just connect to Tailscale before visiting /admin.
//
// Option C — Cloudflare Zero Trust (no VPN, just Google login):
//   See docs/ADMIN_SECURITY.md → Option B → Zero Trust section.
//
// ─── TEMPORARILY DISABLE (for initial setup / testing) ─────────────────────────
//   Set env var: ADMIN_IP_RESTRICTION=disabled
//   Remove or change back to 'enabled' before going live.
// ───────────────────────────────────────────────────────────────────────────────

function isAllowedIP(ip: string): boolean {
    // Always allow localhost (dev)
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') return true;

    // If restriction is disabled via env var — allow everyone (for testing only)
    if (process.env.ADMIN_IP_RESTRICTION === 'disabled') return true;

    // Tailscale IPs — all start with 100. (auto-allowed, no config needed)
    if (ip.startsWith('100.')) return true;

    // IPs from env var ALLOWED_ADMIN_IPS (comma-separated)
    const envIPs = process.env.ALLOWED_ADMIN_IPS;
    if (envIPs) {
        const allowed = envIPs.split(',').map(s => s.trim()).filter(Boolean);
        if (allowed.includes(ip)) return true;
    }

    return false;
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only protect /admin routes — all customer pages are unaffected
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Get the real client IP (works on Vercel, Cloudflare, plain servers)
    const ip =
        req.headers.get('x-real-ip') ??
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        '0.0.0.0';

    if (isAllowedIP(ip)) {
        return NextResponse.next(); // ✅ Allowed
    }

    // ❌ Blocked — show a clean 403 page
    return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>403 — Access Restricted</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f172a; color: #e2e8f0;
           display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { text-align: center; padding: 3rem; background: #1e293b; border-radius: 1rem;
            border: 1px solid #334155; max-width: 420px; }
    h1 { font-size: 3rem; margin: 0 0 0.5rem; }
    p  { color: #94a3b8; margin: 0.5rem 0; }
    a  { color: #6366f1; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔒</h1>
    <h2>Access Restricted</h2>
    <p>Admin access is limited to authorized personnel only.</p>
    <p>Your IP: <strong>${ip}</strong></p>
    <p style="margin-top:1.5rem"><a href="/">← Back to Store</a></p>
  </div>
</body>
</html>`,
        { status: 403, headers: { 'Content-Type': 'text/html' } }
    );
}

export const config = {
    matcher: ['/admin/:path*'],
};
