import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Get the Signing Secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SIGNING_SECRET is not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred during verification", {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      // Insert user into database
      await db.insert(users).values({
        id: id,
        clerkUserId: id,
        email: email_addresses[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim() || null,
        imageUrl: image_url || null,
      });

      console.log(`✅ User created in database: ${id}`);
      return new Response("User created", { status: 201 });
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      // Update user in database
      await db
        .update(users)
        .set({
          email: email_addresses[0]?.email_address || "",
          name: `${first_name || ""} ${last_name || ""}`.trim() || null,
          imageUrl: image_url || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));

      console.log(`✅ User updated in database: ${id}`);
      return new Response("User updated", { status: 200 });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (id) {
        // Delete user from database (cascades to related records)
        await db.delete(users).where(eq(users.id, id));

        console.log(`✅ User deleted from database: ${id}`);
        return new Response("User deleted", { status: 200 });
      }
    }

    // Return success for unhandled event types
    console.log(`ℹ️ Unhandled webhook event type: ${eventType}`);
    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error(`❌ Error processing webhook ${eventType}:`, error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
