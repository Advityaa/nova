import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Issues short-lived client tokens so the browser uploads straight to Vercel
// Blob. This avoids the ~4.5 MB request-body limit on Vercel functions (phone
// photos often exceed it) and keeps the file bytes off our server.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // /api/* is not covered by the middleware, so gate it here.
        const session = await auth();
        if (!session?.user) throw new Error("Not signed in");
        return {
          allowedContentTypes: ["image/*"],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20 MB
          // Blob v2 no longer suffixes by default; without this, re-uploading
          // a common filename (e.g. IMG_1234.jpg) fails with "already exists".
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Upload error:", error);
    const status = message === "Not signed in" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
