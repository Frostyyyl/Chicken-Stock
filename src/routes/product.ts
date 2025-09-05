import express from 'express';
import Product from '../models/product';

const router = express.Router();

// Route to display product details
router.get('/:id', async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);

  if (!req.session.cart) {
    req.session.cart = [];
  }

  if (!product) {
    return res.status(404).render('error', {
      message: 'Error 404 - page not found'
    });
  }

  res.render('product', {
    product: product, inCart: req.session.cart.find((item: { id: string }) => item.id === id)
  });
});

export default router;