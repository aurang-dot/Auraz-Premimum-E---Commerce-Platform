// API route for real-time sync
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req;

  try {
    if (method === 'GET') {
      const endpoint = query.endpoint as string;

      if (endpoint === 'last') {
        // Get last sync timestamp
        const timestamp = Date.now();
        return res.status(200).json({ timestamp });
      }

      if (endpoint === 'updates') {
        // Check for updates since timestamp
        const since = parseInt(query.since as string) || 0;
        const now = Date.now();

        // Get recent orders, users (products don't have created_at, so we'll check all)
        const sinceDate = new Date(since);
        const { rows: recentOrders } = await sql`
          SELECT COUNT(*) as count FROM orders 
          WHERE created_at > ${sinceDate.toISOString()}
        `;

        const { rows: recentUsers } = await sql`
          SELECT COUNT(*) as count FROM users 
          WHERE created_at > ${sinceDate.toISOString()}
        `;

        // For products, we'll just check if there are any products (simpler approach)
        const { rows: recentProducts } = await sql`
          SELECT COUNT(*) as count FROM products
        `;

        const hasUpdates =
          parseInt(recentOrders[0]?.count || 0) > 0 ||
          parseInt(recentUsers[0]?.count || 0) > 0 ||
          parseInt(recentProducts[0]?.count || 0) > 0;

        return res.status(200).json({
          hasUpdates,
          timestamp: now,
          orders: parseInt(recentOrders[0]?.count || 0),
          users: parseInt(recentUsers[0]?.count || 0),
          products: parseInt(recentProducts[0]?.count || 0),
        });
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('Sync API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

