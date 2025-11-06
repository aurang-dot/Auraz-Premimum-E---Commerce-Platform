// API route for authentication
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req;

  try {
    switch (method) {
      case 'POST':
        const { email, password } = body;

        // Check if this is a login request (has email and password, no action)
        if (email && password && !body.action) {
          // Admin login check
          if (email === 'auraz@admin.com' && password === 'auraz878') {
            return res.status(200).json({
              success: true,
              user: {
                id: 'admin',
                name: 'Admin',
                email: 'auraz@admin.com',
                phone: '',
                password: 'auraz878',
                status: 'approved',
                createdAt: new Date().toISOString(),
                addresses: [],
                paymentMethods: [],
                usedVouchers: [],
              },
              isAdmin: true,
            });
          }

          // User login
          const { rows: userRows } = await sql`
            SELECT * FROM users WHERE email = ${email} LIMIT 1
          `;

          if (userRows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
          }

          const user = userRows[0];
          if (user.password !== password) {
            return res.status(401).json({ success: false, error: 'Invalid password' });
          }

          if (user.status === 'pending') {
            return res.status(403).json({ success: false, error: 'Account pending approval' });
          }

          if (user.status === 'rejected') {
            return res.status(403).json({ success: false, error: 'Account rejected' });
          }

          // Transform database user to frontend format
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            profilePhoto: user.profile_photo,
            dateOfBirth: user.date_of_birth,
            gender: user.gender,
            status: user.status,
            createdAt: user.created_at,
            addresses: user.addresses || [],
            paymentMethods: user.payment_methods || [],
            usedVouchers: user.used_vouchers || [],
          };

          return res.status(200).json({
            success: true,
            user: userData,
            isAdmin: false,
          });
        }

        // Register request
        if (body.action === 'register' || body.name) {
          const { name, phone, profilePhoto, dateOfBirth, gender } = body;

          // Check if user already exists
          const { rows: existingUsers } = await sql`
            SELECT id FROM users WHERE email = ${email} LIMIT 1
          `;

          if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
          }

          // Create new user
          const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const createdAt = new Date().toISOString();

          await sql`
            INSERT INTO users (
              id, name, email, phone, password, profile_photo, 
              date_of_birth, gender, status
            ) VALUES (
              ${userId}, ${name}, ${email}, ${phone || ''}, ${password}, 
              ${profilePhoto || null}, ${dateOfBirth || null}, 
              ${gender || null}, 'pending'
            )
          `;

          return res.status(201).json({
            success: true,
            message: 'Registration submitted! Please wait for admin approval.',
            user: {
              id: userId,
              name,
              email,
              phone: phone || '',
              password,
              profilePhoto,
              dateOfBirth,
              gender,
              status: 'pending',
              createdAt,
              addresses: [],
              paymentMethods: [],
              usedVouchers: [],
            },
          });
        }

        return res.status(400).json({ success: false, error: 'Invalid action' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Auth API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

