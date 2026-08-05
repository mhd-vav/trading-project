// scripts/telegram-bot.ts
import { loadEnvConfig } from "@next/env";
import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

loadEnvConfig(process.cwd());

function requiredEnvironmentValue(variableName: string) {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(`${variableName} is required.`);
  }

  return value;
}

const botToken = requiredEnvironmentValue("TELEGRAM_BOT_TOKEN");
const webAppUrl = requiredEnvironmentValue("TELEGRAM_WEB_APP_URL");
const botMode = process.env.TELEGRAM_BOT_MODE ?? "polling";
const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
const webhookPort = Number(process.env.TELEGRAM_WEBHOOK_PORT ?? "3001");

if (!Number.isSafeInteger(webhookPort) || webhookPort < 1 || webhookPort > 65535) {
  throw new Error("TELEGRAM_WEBHOOK_PORT must be a valid TCP port.");
}

const bot = new Bot(botToken);

function miniAppKeyboard() {
  return new InlineKeyboard()
    .webApp("باز کردن مافید", webAppUrl)
    .row()
    .url("وب‌سایت مافید", webAppUrl);
}

async function replyWithMiniApp(
  chatId: number,
  message: string,
) {
  await bot.api.sendMessage(chatId, message, {
    reply_markup: miniAppKeyboard(),
  });
}

bot.command("start", async (context) => {
  await replyWithMiniApp(
    context.chat.id,
    "به مافید خوش آمدید.\nاز مینی‌اپ برای دیده‌بان بازار، ترمینال و میزهای هوشمند استفاده کنید.",
  );
});

bot.command("help", async (context) => {
  await context.reply(
    "دستورهای ربات:\n/markets — دیده‌بان بازار\n/chart — ترمینال نمودار\n/settings — حساب و ترجیحات\n/help — راهنما",
    { reply_markup: miniAppKeyboard() },
  );
});

bot.command("markets", async (context) => {
  await replyWithMiniApp(
    context.chat.id,
    "برای انتخاب نماد و ورود به ترمینال، مینی‌اپ مافید را باز کنید.",
  );
});

bot.command("chart", async (context) => {
  await replyWithMiniApp(
    context.chat.id,
    "ترمینال نمودار در مینی‌اپ باز می‌شود و داده را از سرویس‌های متصل دریافت می‌کند.",
  );
});

bot.command("settings", async (context) => {
  await replyWithMiniApp(
    context.chat.id,
    "برای مدیریت حساب، ترجیحات و وضعیت دعوت‌ها، مینی‌اپ را باز کنید.",
  );
});

bot.catch((error) => {
  console.error("Telegram bot update failed.", error.error);
});

async function configureBot() {
  await bot.api.setMyCommands([
    { command: "start", description: "باز کردن مافید" },
    { command: "markets", description: "دیده‌بان بازار" },
    { command: "chart", description: "ترمینال نمودار" },
    { command: "settings", description: "حساب و ترجیحات" },
    { command: "help", description: "راهنما" },
  ]);
  await bot.api.setChatMenuButton({
    menu_button: {
      type: "web_app",
      text: "باز کردن مافید",
      web_app: { url: webAppUrl },
    },
  });
}

function startWebhookServer() {
  if (!webhookUrl) {
    throw new Error("TELEGRAM_WEBHOOK_URL is required when TELEGRAM_BOT_MODE=webhook.");
  }

  const handleUpdate = webhookCallback(bot, "http");
  const server = createServer(
    async (request: IncomingMessage, response: ServerResponse) => {
      if (request.method !== "POST" || request.url !== "/telegram/webhook") {
        response.writeHead(404).end();
        return;
      }

      const requestSecret = request.headers["x-telegram-bot-api-secret-token"];
      if (webhookSecret && requestSecret !== webhookSecret) {
        response.writeHead(401).end();
        return;
      }

      await handleUpdate(request, response);
    },
  );

  server.listen(webhookPort, () => {
    console.info(`Telegram webhook server is listening on port ${webhookPort}.`);
  });

  return server;
}

async function startBot() {
  await configureBot();

  if (botMode === "webhook") {
    const configuredWebhookUrl = webhookUrl ?? requiredEnvironmentValue("TELEGRAM_WEBHOOK_URL");

    await bot.api.setWebhook(configuredWebhookUrl, {
      secret_token: webhookSecret,
      allowed_updates: ["message"],
    });
    const webhookServer = startWebhookServer();

    process.once("SIGINT", () => webhookServer.close());
    process.once("SIGTERM", () => webhookServer.close());
    return;
  }

  if (botMode !== "polling") {
    throw new Error("TELEGRAM_BOT_MODE must be either polling or webhook.");
  }

  await bot.api.deleteWebhook({ drop_pending_updates: false });
  console.info("Telegram bot is running with long polling.");
  await bot.start({
    allowed_updates: ["message"],
  });
}

void startBot();
