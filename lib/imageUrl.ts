/**
 * Turns share links from Dropbox / Google Drive into direct image URLs that an
 * <img> tag can render. Share links normally open an HTML preview page, which
 * is why pasted links showed only a broken-image placeholder. Any other URL is
 * returned unchanged.
 */
export function toDirectImageUrl(input: string | null | undefined): string {
  const raw = (input ?? "").trim();
  if (!raw) return "";

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return raw; // relative paths like /images/1.jpg
  }

  const host = u.hostname.toLowerCase();

  // Dropbox: www.dropbox.com/scl/fi/…?rlkey=…&dl=0  →  same link with raw=1
  if (host === "dropbox.com" || host === "www.dropbox.com") {
    u.searchParams.delete("dl");
    u.searchParams.set("raw", "1");
    return u.toString();
  }

  // Google Drive: /file/d/<id>/view  or  /open?id=<id>  or  /uc?id=<id>
  if (host === "drive.google.com") {
    const id =
      u.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? u.searchParams.get("id");
    if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  }

  return raw;
}
