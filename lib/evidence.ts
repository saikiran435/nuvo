import { del, get, keys, set } from "idb-keyval";

const PREFIX = "nuvo-evidence-";

export async function storeEvidence(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("not-image");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("no-canvas");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("blob"))), "image/jpeg", 0.82);
  });
  const key = `${PREFIX}${crypto.randomUUID()}`;
  await set(key, blob);
  return key;
}

export async function evidenceUrl(key: string): Promise<string | null> {
  const blob = await get<Blob>(key);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function clearAllEvidence(): Promise<void> {
  const all = await keys();
  await Promise.all(
    all.filter((key) => String(key).startsWith(PREFIX)).map((key) => del(key)),
  );
}
