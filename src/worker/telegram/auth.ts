import type { Env } from "../env";

export class AuthError extends Error {}

const encoder = new TextEncoder();

const toHex = (bytes: ArrayBuffer): string =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const hmac = async (key: BufferSource, value: string): Promise<ArrayBuffer> => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
};

const equals = (left: string, right: string): boolean => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
};

export const getTelegramUserId = async (request: Request, env: Env): Promise<string> => {
  const authorization = request.headers.get("authorization");
  const initData = request.headers.get("x-telegram-init-data")
    ?? (authorization?.startsWith("tma ") ? authorization.slice(4) : null);

  if (!initData && env.ENVIRONMENT !== "production" && env.DEV_MOCK_TELEGRAM_USER_ID) {
    return env.DEV_MOCK_TELEGRAM_USER_ID;
  }
  if (!initData || !env.TELEGRAM_BOT_TOKEN) throw new AuthError("Telegram authorization required");

  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const userValue = params.get("user");
  if (!receivedHash || !userValue) throw new AuthError("Invalid Telegram authorization data");

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = await hmac(encoder.encode("WebAppData"), env.TELEGRAM_BOT_TOKEN);
  const calculatedHash = toHex(await hmac(secret, dataCheckString));
  if (!equals(calculatedHash, receivedHash)) throw new AuthError("Telegram authorization signature is invalid");

  let user: { id?: number };
  try {
    user = JSON.parse(userValue) as { id?: number };
  } catch {
    throw new AuthError("Invalid Telegram user data");
  }
  if (!Number.isSafeInteger(user.id)) throw new AuthError("Invalid Telegram user id");
  return String(user.id);
};

export const ensureUser = async (env: Env, telegramUserId: string): Promise<void> => {
  await env.DB.prepare(
    "INSERT INTO users (telegram_user_id) VALUES (?) ON CONFLICT(telegram_user_id) DO NOTHING"
  ).bind(telegramUserId).run();
};
