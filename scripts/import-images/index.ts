import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type MediaRecord = { slug: string; url: string; output: string };

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = resolve(root, "data/media/wiki-manifest.json");
const outputDirectory = resolve(root, "public/media/wiki");

const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as MediaRecord[];
await mkdir(outputDirectory, { recursive: true });

for (const media of manifest) {
  const source = new URL(media.url);
  if (source.hostname !== "static.wikia.nocookie.net" || !media.output.endsWith(".webp")) {
    throw new Error(`Unexpected media source for ${media.slug}`);
  }
  const response = await fetch(source, { headers: { accept: "image/webp,image/*;q=0.8" } });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Could not import ${media.slug}: ${response.status}`);
  }
  const destination = resolve(outputDirectory, media.output);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.info(`Imported ${media.slug} → public/media/wiki/${media.output}`);
}

