// API route for users
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req;

  try {
    switch (method) {
      case 'GET':
        const { rows } = await sql`
          SELECT * FROM users ORDER BY created_at DESC
        `;
        // Transform database rows to match frontend format
        const users = rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          password: row.password,
          profilePhoto: row.profile_photo,
          dateOfBirth: row.date_of_birth,
          gender: row.gender,
          status: row.status,
          createdAt: row.created_at,
          usedVouchers: row.used_vouchers || [],
          addresses: row.addresses || [],
          paymentMethods: row.payment_methods || []
        }));
        return res.status(200).json({ success: true, data: users });

      case 'POST':
        const { id, name, email, phone, password, profilePhoto, dateOfBirth, gender, status = 'pending' } = body;
        
        await sql`
          INSERT INTO users (
            id, name, email, phone, password, profile_photo, date_of_birth, gender, status
          ) VALUES (
            ${id}, ${name}, ${email}, ${phone}, ${password}, ${profilePhoto || null}, 
            ${dateOfBirth || null}, ${gender || null}, ${status}
          )
        `;
        return res.status(201).json({ success: true, message: 'User created' });

      case 'PUT':
        const { userId, updates } = body;
        const updateFields: string[] = [];
        const updateValues: any[] = [];
        
        const fieldMap: any = {
          name: 'name',
          email: 'email',
          phone: 'phone',
          password: 'password',
          profilePhoto: 'profile_photo',
          dateOfBirth: 'date_of_birth',
          gender: 'gender',
          status: 'status',
          usedVouchers: 'used_vouchers',
          addresses: 'addresses',
          paymentMethods: 'payment_methods'
        };
        
        Object.keys(updates).forEach(key => {
          const dbKey = fieldMap[key] || key;
          if (['usedVouchers', 'addresses', 'paymentMethods'].includes(key)) {
            updateFields.push(`${dbKey} = $${updateFields.length + 1}::jsonb`);
            updateValues.push(JSON.stringify(updates[key]));
          } else {
            updateFields.push(`${dbKey} = $${updateFields.length + 1}`);
            updateValues.push(updates[key]);
          }
        });
        
        if (updateFields.length > 0) {
          updateValues.push(userId);
          await sql.query(`
            UPDATE users 
            SET ${updateFields.join(', ')} 
            WHERE id = $${updateFields.length + 1}
          `, updateValues);
        }
        return res.status(200).json({ success: true, message: 'User updated' });

      case 'DELETE':
        const { userId: deleteId } = body;
        await sql`DELETE FROM users WHERE id = ${deleteId}`;
        return res.status(200).json({ success: true, message: 'User deleted' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Users API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

