import type { Env } from "./env";

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      try {
        const result = await env.DB.prepare("SELECT 1 AS value").first<{ value: number }>();
        if (result?.value !== 1) throw new Error("Unexpected D1 health result");
        return json({ status: "ok", database: "connected" });
      } catch {
        return json({ status: "error", database: "unavailable" }, 503);
      }
    }

    return json({ error: "Not found" }, 404);
  }
} satisfies ExportedHandler<Env>;

