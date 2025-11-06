# AURAZ Premium E-Commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, and Vite. Deployed on Vercel with PostgreSQL database for shared data across all users.

## 🚀 Features

- **User Management**: Registration, login, profile management
- **Product Catalog**: Browse, search, filter products
- **Shopping Cart**: Add to cart, checkout process
- **Order Management**: Track orders, order history
- **Admin Panel**: Complete admin dashboard for managing products, users, orders
- **Payment System**: Payment verification workflow
- **Vouchers & Promotions**: Discount codes and promo cards
- **Reviews & Ratings**: Product reviews system
- **Notifications**: Real-time notifications for users and admins
- **AI Assistant**: Built-in customer support chat

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Radix UI, Tailwind CSS, Lucide Icons
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres (PostgreSQL)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account
- Vercel account (free tier available)

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/auraz-ecommerce.git
   cd auraz-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit `http://localhost:3000`

### Production Deployment

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for complete deployment instructions.

**Quick Steps:**
1. Push code to GitHub
2. Create Vercel Postgres database
3. Deploy to Vercel
4. Initialize database via `/api/init`
5. Start using the platform!

## 📁 Project Structure

```
├── api/                 # Vercel serverless functions
│   ├── db.ts           # Database utilities and schema
│   ├── init.ts         # Database initialization
│   ├── products.ts     # Products API
│   ├── users.ts        # Users API
│   └── orders.ts       # Orders API
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and context
│   └── assets/         # Static assets
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies

```

## 🔐 Admin Access

Default admin credentials:
- **Email**: `auraz@admin.com`
- **Password**: `auraz878`

**⚠️ Change these credentials after first deployment!**

## 📖 Documentation

- [GitHub Setup Guide](./GITHUB_SETUP.md) - Complete deployment guide
- [Deployment Guide](./DEPLOYMENT.md) - Vercel deployment details

## 🌐 Environment Variables

Required in Vercel Dashboard:
- `POSTGRES_URL` - PostgreSQL connection string
- `POSTGRES_PRISMA_URL` - Prisma connection string
- `POSTGRES_URL_NON_POOLING` - Non-pooling connection string

## 🗄️ Database

The platform uses Vercel Postgres (PostgreSQL) for:
- User accounts and authentication
- Product catalog
- Orders and transactions
- Reviews and ratings
- Notifications
- Conversations

All data is shared across all users globally.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
- Check the [GitHub Setup Guide](./GITHUB_SETUP.md)
- Review Vercel logs in the dashboard
- Check database connection settings

---

**Built with ❤️ for modern e-commerce**
