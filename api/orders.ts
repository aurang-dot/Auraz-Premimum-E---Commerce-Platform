// API route for orders
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req;

  try {
    switch (method) {
      case 'GET':
        const { rows } = await sql`
          SELECT o.*, u.name as user_name, u.email as user_email
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          ORDER BY o.created_at DESC
        `;
        const orders = rows.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          user: {
            id: row.user_id,
            name: row.user_name,
            email: row.user_email
          },
          items: row.items,
          total: parseFloat(row.total),
          status: row.status,
          shippingAddress: row.shipping_address,
          paymentMethod: row.payment_method,
          createdAt: row.created_at,
          deliveryCharge: parseFloat(row.delivery_charge || 0),
          voucherDiscount: row.voucher_discount ? parseFloat(row.voucher_discount) : null,
          voucherCode: row.voucher_code
        }));
        return res.status(200).json({ success: true, data: orders });

      case 'POST':
        const { id, userId, items, total, status = 'pending', shippingAddress, paymentMethod, deliveryCharge = 0, voucherDiscount, voucherCode } = body;
        
        await sql`
          INSERT INTO orders (
            id, user_id, items, total, status, shipping_address, payment_method, 
            delivery_charge, voucher_discount, voucher_code
          ) VALUES (
            ${id}, ${userId}, ${JSON.stringify(items)}, ${total}, ${status}, 
            ${JSON.stringify(shippingAddress)}, ${paymentMethod}, ${deliveryCharge},
            ${voucherDiscount || null}, ${voucherCode || null}
          )
        `;
        return res.status(201).json({ success: true, message: 'Order created' });

      case 'PUT':
        const { orderId, updates } = body;
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        
        const fieldMap: any = {
          status: 'status',
          shippingAddress: 'shipping_address',
          paymentMethod: 'payment_method',
          deliveryCharge: 'delivery_charge',
          voucherDiscount: 'voucher_discount',
          voucherCode: 'voucher_code'
        };
        
        Object.keys(updates).forEach(key => {
          const dbKey = fieldMap[key] || key;
          if (key === 'shippingAddress') {
            updateFields.push(`${dbKey} = $${updateFields.length + 1}::jsonb`);
            updateValues.push(JSON.stringify(updates[key]));
          } else {
            updateFields.push(`${dbKey} = $${updateFields.length + 1}`);
            updateValues.push(updates[key]);
          }
        });
        
        if (updateFields.length > 0) {
          updateValues.push(orderId);
          await sql.query(`
            UPDATE orders 
            SET ${updateFields.join(', ')} 
            WHERE id = $${updateFields.length + 1}
          `, updateValues);
        }
        return res.status(200).json({ success: true, message: 'Order updated' });

      case 'DELETE':
        const { orderId: deleteId } = body;
        await sql`DELETE FROM orders WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true, message: 'Order deleted' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Orders API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

