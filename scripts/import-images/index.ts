import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type MediaRecord = { slug: string; url: string; output: string };
type FandomImageInfoResponse = {
  query?: {
    pages?: Record<string, {
      missing?: string;
      imageinfo?: Array<{ url?: string }>;
    }>;
  };
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = resolve(root, "data/media/wiki-manifest.json");
const blackForestSeedPath = resolve(root, "src/worker/services/seed-black-forest.ts");
const outputDirectory = resolve(root, "public/media/wiki");

const staticManifest = JSON.parse(await readFile(manifestPath, "utf8")) as MediaRecord[];
const seedSource = await readFile(blackForestSeedPath, "utf8");

const blackForestManifest: MediaRecord[] = seedSource
  .split("\n")
  .map((line) => {
    const match = line.match(/\{ slug: "([^"]+)".*imageFile: "([^"]+)"/);
    if (!match) return null;
    const [, slug, imageFile] = match;
    return {
      slug,
      url: imageFile,
      output: `${slug}.png`
    };
  })
  .filter((entry): entry is MediaRecord => Boolean(entry));

const manifest = new Map<string, MediaRecord>();
for (const entry of [...staticManifest, ...blackForestManifest]) {
  manifest.set(entry.output, entry);
}

const userAgent = "VALHEIM-Guide/0.1 (+https://github.com/maksutenkox/valheim-guide)";

const resolveFandomFile = async (fileName: string): Promise<string | null> => {
  const api = new URL("https://valheim.fandom.com/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("formatversion", "2");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("titles", `File:${fileName}`);

  const response = await fetch(api, {
    headers: {
      accept: "application/json",
      "user-agent": userAgent
    }
  });

  if (!response.ok) {
    throw new Error(`Could not resolve Fandom file ${fileName}: HTTP ${response.status}`);
  }

  const payload = await response.json() as FandomImageInfoResponse;
  const pages = Object.values(payload.query?.pages ?? {});
  const imageUrl = pages[0]?.imageinfo?.[0]?.url;
  if (!imageUrl) return null;

  const resolved = new URL(imageUrl);
  if (resolved.hostname !== "static.wikia.nocookie.net") {
    throw new Error(`Unexpected resolved image host for ${fileName}: ${resolved.hostname}`);
  }
  return resolved.toString();
};

const resolveValheimToolsIcon = async (slug: string): Promise<string | null> => {
  const candidates = [
    `https://www.valheim.tools/items/${slug}`,
    `https://www.valheim.tools/building/${slug}`
  ];

  for (const pageUrl of candidates) {
    const response = await fetch(pageUrl, {
      headers: {
        accept: "text/html",
        "user-agent": userAgent
      }
    });
    if (!response.ok) continue;

    const html = await response.text();
    const match =
      html.match(/(?:src|href)=["']([^"']*\/icons\/[^"']+\.png)["']/i)
      ?? html.match(/https:\/\/www\.valheim\.tools\/icons\/[^"'<> ]+\.png/i);

    const raw = match?.[1] ?? match?.[0];
    if (!raw) continue;

    const iconUrl = new URL(raw, pageUrl);
    if (iconUrl.hostname === "www.valheim.tools" && iconUrl.pathname.startsWith("/icons/")) {
      return iconUrl.toString();
    }
  }
  return null;
};

await mkdir(outputDirectory, { recursive: true });

for (const media of manifest.values()) {
  const isBundledManifestUrl = media.url.startsWith("https://static.wikia.nocookie.net/");
  const sourceUrl = isBundledManifestUrl
    ? media.url
    : (await resolveFandomFile(media.url)) ?? (await resolveValheimToolsIcon(media.slug));

  if (!sourceUrl) {
    throw new Error(`No image source found for ${media.slug} (Fandom file: ${media.url})`);
  }

  const response = await fetch(sourceUrl, {
    headers: {
      accept: media.output.endsWith(".png") ? "image/png,image/*;q=0.8" : "image/webp,image/*;q=0.8",
      "user-agent": userAgent
    }
  });

  const finalUrl = new URL(response.url);
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("image/") || !["static.wikia.nocookie.net", "www.valheim.tools"].includes(finalUrl.hostname)) {
    throw new Error(`Could not import ${media.slug}: ${response.status} ${response.url} ${contentType}`);
  }

  const destination = resolve(outputDirectory, media.output);
  if (!destination.startsWith(outputDirectory)) throw new Error(`Unsafe media output path for ${media.slug}`);

  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.info(`Imported ${media.slug} → public/media/wiki/${media.output}`);
}
