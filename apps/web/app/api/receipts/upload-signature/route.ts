import { generateUploadSignature } from "@/lib/cloudinary";
import { getAuthUserId } from "@/lib/api/auth";

export async function POST(request: Request) {
  const userId = await getAuthUserId(request);

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `billo/receipts/${userId}`;

    // Parameters to sign (for signed uploads, we sign timestamp and folder)
    // Note: upload_preset is for unsigned uploads, so we don't include it in signed uploads
    const paramsToSign: Record<string, string> = {
      timestamp: timestamp.toString(),
      folder,
    };

    // Generate signature
    const signature = generateUploadSignature(paramsToSign);

    // Return signature and upload parameters
    return Response.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return Response.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
