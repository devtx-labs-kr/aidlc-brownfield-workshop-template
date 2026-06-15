import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import analyticsRoutes from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const fallbackOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|(?:\d{1,3}\.){3}\d{1,3})(:\d{1,5})?$/;

app.use(cors({
  origin: (origin, callback) => {
    const isAllowedOrigin = !origin ||
      (configuredOrigins.length > 0
        ? configuredOrigins.includes(origin)
        : fallbackOriginPattern.test(origin));

    if (isAllowedOrigin) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));

initDb();

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
