import express from 'express';
import session from 'express-session';
import path from 'path';
import indexRoutes from './routes/index';
import cartRoutes from './routes/cart';
import productRoutes from './routes/product';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);

export default app;