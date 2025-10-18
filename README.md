🧩 Vercel Blob Transfer

A simple Node.js script to transfer all files and folders between two Vercel Blob Storages — including nested folders, root files, and public access support.

🚀 Features

✅ Transfers all folders and files (including root files)

✅ Preserves folder structure

✅ Shows progress, ETA, and time per file

✅ Provides a summary at the end (total files, folders, total time)

✅ Works with public or private blobs

🛠️ Requirements

Node.js v18+

Access to both source and target Vercel Blob stores

Tokens with read/write permissions

⚙️ Setup

Clone the repo

git clone [https://github.com/yourusername/vercel-blob-transfer.git](https://github.com/anisulislam10/vercel-blob-sync.git)
cd vercel-blob-transfer


Install dependencies

npm install node-fetch @vercel/blob


Edit the config
Open transfer-blobs.js and update:

const SOURCE_TOKEN = "vercel_blob_rw_XXXXXXXX";
const TARGET_TOKEN = "vercel_blob_rw_YYYYYYYY";
const INCLUDED_FOLDERS = ["addons/", "categories/", "items/", "offers/", "profiles/"];

▶️ Usage

To start transferring:

node transfer-blobs.js


Example output:

📦 Fetching blobs from source store...
📁 Total Blobs Found: 312

⬇️ [1/312] Downloading: addons/banner.webp
⬆️ Uploading: addons/banner.webp
✅ Uploaded: https://newblob.vercel.app/addons/banner.webp
⏱️ Time: 3s | ETA: 15m 22s | Progress: 1/312

🎉 Transfer Summary:
📁 Folders: 5
📄 Files: 312
🕒 Total Time: 8m 34s
📦 Saved in: ./temp_downloads

📂 Folder Structure
vercel-blob-transfer/
│
├── transfer-blobs.js      # Main transfer script
├── package.json
├── README.md
└── temp_downloads/        # Temporary download folder (auto-created)
