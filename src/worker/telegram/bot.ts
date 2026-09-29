import type { Env } from "../env";

type TelegramUpdate = {
  message?: { chat: { id: number }; text?: string };
};

const telegramApi = async (env: Env, method: string, payload: unknown): Promise<void> => {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Telegram ${method} failed with ${response.status}`);
};

export const handleTelegramUpdate = async (request: Request, env: Env): Promise<Response> => {
  const expectedSecret = env.TELEGRAM_WEBHOOK_SECRET;
  if (!expectedSecret || request.headers.get("x-telegram-bot-api-secret-token") !== expectedSecret) {
    return new Response("Unauthorized", { status: 401 });
  }
  const update = await request.json<TelegramUpdate>();
  const message = update.message;
  if (message?.text === "/start") {
    await telegramApi(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "⚔️ <b>VALHEIM Guide</b>\n\nВсе предметы, рецепты и ресурсы Valheim в одном месте.",
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Открыть гайд", web_app: { url: env.PUBLIC_APP_URL } }]]
      }
    });
  }
  return new Response("OK");
};
