import { auth } from '@clerk/nextjs/server';
import db from '@/db/config/connection';
import { receipts } from '@/db/models/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * POST /api/receipts
 * Create a new receipt record after successful Cloudinary upload
 *
 * Body: { imageUrl, imagePublicId, thumbnailUrl? }
 */
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl, imagePublicId, thumbnailUrl } = body;

    // Validate required fields
    if (!imageUrl || !imagePublicId) {
      return Response.json(
        { error: 'Missing required fields: imageUrl and imagePublicId' },
        { status: 400 }
      );
    }

    // Create receipt record
    const [receipt] = await db
      .insert(receipts)
      .values({
        userId,
        imageUrl,
        imagePublicId,
        thumbnailUrl: thumbnailUrl || null,
        status: 'pending',
      })
      .returning();

    return Response.json(receipt, { status: 201 });
  } catch (error) {
    console.error('Error creating receipt:', error);
    return Response.json(
      { error: 'Failed to create receipt' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/receipts
 * List all receipts for the authenticated user
 *
 * Query params: ?status=completed (optional filter)
 */
export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Build query
    let query = db
      .select()
      .from(receipts)
      .where(eq(receipts.userId, userId))
      .orderBy(desc(receipts.createdAt))
      .$dynamic();

    // Apply status filter if provided
    if (statusFilter) {
      query = query.where(eq(receipts.status, statusFilter as any));
    }

    const userReceipts = await query;

    return Response.json({
      receipts: userReceipts,
      total: userReceipts.length,
    });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return Response.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}
