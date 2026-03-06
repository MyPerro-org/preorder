import { connectToDatabase } from '@/lib/mongodb';

// This endpoint now answers the UI's question: has any captured payment of ₹2499 been recorded?
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Count submissions where amount is 2499 and paymentStatus is captured
    const count = await db.collection('submissions').countDocuments({
      amount: 2499,
      paymentStatus: 'captured',
    });

    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to get captured ₹2499 payments', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
