import express from 'express';
import Product from '../models/product';
import { Op } from 'sequelize'; 

const router = express.Router();

// Route to display all products
router.get('/', async (req: express.Request, res: express.Response) => {
  const products = await Product.findAll();

  if (!req.session.cart) {
    req.session.cart = [];
  }

  res.render('index', { products: products});
});

// Route to handle search
router.get('/search', async (req: express.Request, res: express.Response) => {
  const query = req.query.q as string;

  if (!query) {
    return res.redirect('/');
  }

  const products = await Product.findAll({
    where: {
      name: {
        [Op.like]: `%${query}%`,
      },
    },
  });

  res.render('index', { products: products});
});

export default router;