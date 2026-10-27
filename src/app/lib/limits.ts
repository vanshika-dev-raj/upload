const MB = 1024 * 1024;

export const MAX_IMAGE_SIZE = 4 * MB;
export const MAX_FILE_SIZE = 25 * MB;

// Shared by the browser (instant feedback) and the server (the real check).
// Returns an error message, or null when the file is within the limit.
export function checkSize(file: File) {
  const isImage = file.type.startsWith("image/");
  const max = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

  if (file.size > max) {
    const size = (file.size / MB).toFixed(1);
    return `${isImage ? "Image" : "File"} is ${size} MB. Max is ${max / MB} MB.`;
  }
  return null;
}
