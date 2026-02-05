# Billo Mobile

Billo is a bill-splitting app (Scan. Tap. Split.) with receipt scanning + AI extraction and manual entry, plus groups and settlements.

## Run

```bash
npm install
npx expo start
```

## Env & Clerk keys

- `apps/mobile/.env` uses `pk_test` (dev warning expected).
- `apps/mobile/.env.production` uses `pk_live` (no warning in production).
- Verify: `NODE_ENV=production npx expo config --type public`
