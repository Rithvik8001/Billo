import { auth } from "@clerk/nextjs/server";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = `billo/receipts/${userId}`;

    // Parameters to sign
    const paramsToSign = {
      timestamp: timestamp.toString(),
      folder,
      upload_preset: "ml_default", // Your existing preset
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
      uploadPreset: "ml_default",
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return Response.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
