// API route for products
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req;

  try {
    switch (method) {
      case 'GET':
        const { rows } = await sql`
          SELECT * FROM products ORDER BY id DESC
        `;
        // Transform database rows to match frontend format
        const products = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          price: parseFloat(row.price || 0),
          originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
          image: row.image,
          images: row.images || [],
          category: row.category || '',
          brand: row.brand || '',
          stock: parseInt(row.stock || 0),
          rating: parseFloat(row.rating || 0),
          reviewCount: parseInt(row.review_count || 0),
          trending: row.trending || false,
          newArrival: row.new_arrival || false,
          isDeal: row.is_deal || false,
          isFestive: row.is_festive || false,
          isElectronics: row.is_electronics || false,
          variants: row.variants || [],
          specifications: row.specifications || {},
          seller: row.seller || {},
        }));
        return res.status(200).json({ success: true, data: products });

      case 'POST':
        const { id, name, description, price, originalPrice, image, images, category, brand, stock, rating, reviewCount, trending, newArrival, isDeal, isFestive, isElectronics, variants, specifications, seller } = body;
        
        await sql`
          INSERT INTO products (
            id, name, description, price, original_price, image, images, category, brand, stock,
            rating, review_count, trending, new_arrival, is_deal, is_festive, is_electronics,
            variants, specifications, seller
          ) VALUES (
            ${id}, ${name}, ${description}, ${price}, ${originalPrice || null}, ${image}, ${JSON.stringify(images || [])}, 
            ${category}, ${brand}, ${stock || 0}, ${rating || 0}, ${reviewCount || 0}, 
            ${trending || false}, ${newArrival || false}, ${isDeal || false}, 
            ${isFestive || false}, ${isElectronics || false}, 
            ${JSON.stringify(variants || [])}, ${JSON.stringify(specifications || {})}, 
            ${JSON.stringify(seller || {})}
          )
        `;
        return res.status(201).json({ success: true, message: 'Product created' });

      case 'PUT':
        const { productId, updates } = body;
        // Dynamic update based on provided fields
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        
        Object.keys(updates).forEach(key => {
          const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updateFields.push(`${dbKey} = $${updateFields.length + 1}`);
          updateValues.push(updates[key]);
        });
        
        if (updateFields.length > 0) {
          updateValues.push(productId);
          await sql.query(`
            UPDATE products 
            SET ${updateFields.join(', ')} 
            WHERE id = $${updateFields.length + 1}
          `, updateValues);
        }
        return res.status(200).json({ success: true, message: 'Product updated' });

      case 'DELETE':
        const { productId: deleteId } = body;
        await sql`DELETE FROM products WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true, message: 'Product deleted' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Products API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

