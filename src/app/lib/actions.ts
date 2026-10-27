"use server";

import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// File types that can be saved. Add more extensions here if needed.
const ALLOWED = [
  ".jpg", ".jpeg", ".png", ".heic", ".webp",
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".csv", ".txt",
];

export async function saveFile(file: File, filename: string) {
  if (!file?.size) {
    return "Choose a file first.";
  }

  const ext = path.extname(file.name).toLowerCase();
  // if (!ALLOWED.includes(ext)) {
  //   return `${ext || "This"} files are not allowed.`;
  // }

  // Only letters, numbers, - and _ so the name stays a plain file name in the bucket.
  const name = String(filename).replace(/[^\w-]/g, "_") || "file";
  const fileName = name + ext;

  // Secret key is server-only: this file runs on the server, never in the browser.
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
  const bucket = process.env.SUPABASE_BUCKET!;

  // upsert: false = don't overwrite an existing file.
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) {
    return error.message.includes("exists")
      ? `${fileName} already exists. Pick another name.`
      : `Upload failed: ${error.message}`;
  }
  return `Saved to ${bucket}/${fileName}`;
}
