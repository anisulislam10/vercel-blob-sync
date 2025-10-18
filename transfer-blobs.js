// transfer-blobs.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { list, put } from "@vercel/blob";

// ====== CONFIG ======
const SOURCE_TOKEN = "YOUR_CURRENT_BLOB_STORGE_KEY";
const TARGET_TOKEN = "YOUR_NEW_BOLB_STORAGE_KEY";
const TEMP_DIR = "./temp_downloads";
const INCLUDED_FOLDERS = ["addons/", "categories/", "items/", "offers/", "profiles/"];


async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const remainingSec = sec % 60;
  return `${min}m ${remainingSec}s`;
}

async function transferBlobs() {
  const startTime = Date.now();

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

  console.log("📦 Fetching blobs from source store...");
  const { blobs } = await list({ token: SOURCE_TOKEN });

  // Include: root files + selected folders
  const filtered = blobs.filter(blob => {
    const isRootFile = !blob.pathname.includes("/");
    const isIncludedFolder = INCLUDED_FOLDERS.some(folder =>
      blob.pathname.startsWith(folder)
    );
    return isRootFile || isIncludedFolder;
  });

  console.log(`\n📁 Total Blobs Found: ${filtered.length}\n`);

  const totalFiles = filtered.length;
  let completed = 0;
  let totalDownloadTime = 0;

  for (const blob of filtered) {
    const startFileTime = Date.now();

    const localPath = path.join(TEMP_DIR, blob.pathname);
    await ensureDir(localPath);

    console.log(`\n⬇️ [${completed + 1}/${totalFiles}] Downloading: ${blob.pathname}`);
    const res = await fetch(blob.url);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(buffer));

    console.log(`⬆️ Uploading: ${blob.pathname}`);
    const uploaded = await put(blob.pathname, fs.createReadStream(localPath), {
      access: "public",
      token: TARGET_TOKEN,
    });

    const fileTime = Date.now() - startFileTime;
    totalDownloadTime += fileTime;
    completed++;

    const avgTime = totalDownloadTime / completed;
    const remaining = totalFiles - completed;
    const eta = avgTime * remaining;

    console.log(
      `✅ Uploaded: ${uploaded.url}\n` +
      `⏱️ Time: ${formatTime(fileTime)} | ETA: ${formatTime(eta)} | Progress: ${completed}/${totalFiles}`
    );
  }

  const totalTime = Date.now() - startTime;

  // Count distinct folders
  const folders = new Set(filtered.map(f => f.pathname.split("/")[0]).filter(f => f));
  console.log("\n🎉 Transfer Summary:");
  console.log(`📁 Folders: ${folders.size}`);
  console.log(`📄 Files: ${totalFiles}`);
  console.log(`🕒 Total Time: ${formatTime(totalTime)}`);
  console.log(`📦 Saved in: ${TEMP_DIR}`);
}

transferBlobs().catch(err => console.error("❌ Error:", err));
