import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB, getDBStatus } from './server/db/mongo.ts';
import { db } from './server/db/database.ts';

import authRoutes from './server/routes/auth.routes.ts';
import userRoutes from './server/routes/user.routes.ts';
import serviceRoutes from './server/routes/service.routes.ts';
import projectRoutes from './server/routes/project.routes.ts';
import proposalRoutes from './server/routes/proposal.routes.ts';
import exchangeRoutes from './server/routes/exchange.routes.ts';
import workspaceRoutes from './server/routes/workspace.routes.ts';
import paymentRoutes from './server/routes/payment.routes.ts';
import reviewRoutes from './server/routes/review.routes.ts';
import notificationRoutes from './server/routes/notification.routes.ts';
import wishlistRoutes from './server/routes/wishlist.routes.ts';
import reportRoutes from './server/routes/report.routes.ts';
import adminRoutes from './server/routes/admin.routes.ts';

dotenv.config();

async function startServer() {
  // Connect to Database
  const mongoConnected = await connectDB();
  if (mongoConnected) {
    await db.syncWithMongo();
  }

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  );
  app.options('*', cors());

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/proposals', proposalRoutes);
  app.use('/api/exchange', exchangeRoutes);
  app.use('/api/workspace', workspaceRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/admin', adminRoutes);

  // Health check & DB status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'TalentTrade API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: getDBStatus(),
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    const status = getDBStatus();
    console.log(`===============================================`);
    console.log(`🚀 TalentTrade API is running on http://localhost:${PORT}`);
    console.log(`🍃 Database Status: ${status.type} ${status.host ? `(${status.host}/${status.name})` : ''}`);
    console.log(`🔌 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`===============================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});