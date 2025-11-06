// API route to initialize database
import { initDatabase } from './db';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await initDatabase();
    
    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

