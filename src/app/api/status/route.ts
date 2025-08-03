import { NextResponse } from 'next/server';

// This endpoint is deprecated - extraction is now done directly in upload
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'This endpoint is deprecated. Use /api/upload for direct extraction.' },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
