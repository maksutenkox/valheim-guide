import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type MediaRecord = { slug: string; url: string; output: string };

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
      url: `https://valheim.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(imageFile)}`,
      output: `${slug}.png`
    };
  })
  .filter((entry): entry is MediaRecord => Boolean(entry));

const manifest = new Map<string, MediaRecord>();
for (const entry of [...staticManifest, ...blackForestManifest]) {
  manifest.set(entry.output, entry);
}

await mkdir(outputDirectory, { recursive: true });

for (const media of manifest.values()) {
  const source = new URL(media.url);
  const isStaticWikia = source.hostname === "static.wikia.nocookie.net";
  const isFandomRedirect = source.hostname === "valheim.fandom.com" && source.pathname.startsWith("/wiki/Special:Redirect/file/");
  if ((!isStaticWikia && !isFandomRedirect) || (!media.output.endsWith(".webp") && !media.output.endsWith(".png"))) {
    throw new Error(`Unexpected media source for ${media.slug}: ${media.url}`);
  }

  const response = await fetch(source, {
    redirect: "follow",
    headers: { accept: media.output.endsWith(".png") ? "image/png,image/*;q=0.8" : "image/webp,image/*;q=0.8" }
  });

  const finalHost = new URL(response.url).hostname;
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("image/") || !["static.wikia.nocookie.net", "valheim.fandom.com"].includes(finalHost)) {
    throw new Error(`Could not import ${media.slug}: ${response.status} ${response.url} ${contentType}`);
  }

  const destination = resolve(outputDirectory, media.output);
  if (!destination.startsWith(outputDirectory)) throw new Error(`Unsafe media output path for ${media.slug}`);

  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.info(`Imported ${media.slug} → public/media/wiki/${media.output}`);
}
