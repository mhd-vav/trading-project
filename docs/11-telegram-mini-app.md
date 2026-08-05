<!-- docs/11-telegram-mini-app.md -->
# Telegram Mini App MVP

## Included

- The mobile-first Mini App is available at `/miniapp`.
- `POST /api/telegram/auth` validates the signed Telegram `initData` before returning a user identity.
- `scripts/telegram-bot.ts` runs the standalone bot with `/start`, `/help`, `/markets`, `/chart`, and `/settings`.
- The bot configures its command menu and a Mini App menu button when it starts.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `TELEGRAM_BOT_TOKEN` to an active token and set `TELEGRAM_WEB_APP_URL` to a public HTTPS URL ending in `/miniapp`.
3. Start the website with `npm run dev`.
4. Start the bot with `npm run bot:dev`.

Telegram Mini Apps require a public HTTPS web address. `http://localhost:3000/miniapp` is available as a browser preview but cannot be used as the production Mini App URL. Use a temporary HTTPS tunnel during local testing, then replace `TELEGRAM_WEB_APP_URL` with the deployed URL.

## Deployment

Run the website and the bot as separate processes. For a persistent deployment, use webhook mode:

```bash
TELEGRAM_BOT_MODE=webhook
TELEGRAM_WEBHOOK_URL=https://your-host.example/telegram/webhook
TELEGRAM_WEBHOOK_SECRET=replace-with-a-long-random-value
TELEGRAM_WEBHOOK_PORT=3001
```

Route the public webhook path to the bot process on port `3001`. The Next.js website continues to serve `/miniapp` independently. The bot token belongs only in the server environment; do not expose it through `NEXT_PUBLIC_` variables or commit it to Git.
