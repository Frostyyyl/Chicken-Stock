import express from "express";
import Product from "../models/product";
import { sequelize } from "../models/product";
import { CartProduct } from "../types/express";

const router = express.Router();

// Route to display the cart
router.get("/", async (req: express.Request, res: express.Response) => {
    const cart = req.session.cart || [];

    const products = await Product.findAll();

    const cartProducts = cart.map((item: CartProduct) => {
        const product = products.find((p) => p.id === parseInt(item.id));
        return {
            ...item,
            name: product?.name || "Unknown Product",
            price: product?.price || 0,
            imageUrl: product?.imageUrl || "/images/default.png",
        };
    });
    const total = cartProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    res.render("cart", { cart: cartProducts, total });
});

// Route to add a product to the cart
router.post("/add", async (req: express.Request, res: express.Response) => {
    const id = req.body.id;
    const quantity = parseInt(req.body.quantity) || 1;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const product = req.session.cart.find(
        (item: CartProduct) => item.id === id
    );

    if (product) {
        product.quantity += quantity;
    } else {
        req.session.cart.push({ id, quantity });
    }

    res.redirect(`/product/${id}`);
});

// Route to delete a product from the cart
router.post("/delete", async (req: express.Request, res: express.Response) => {
    const { id } = req.body;

    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(
            (item: CartProduct) => item.id !== id
        );
    }
    res.redirect("/cart");
});

// Route to clear the cart
router.post("/clear", (req: express.Request, res: express.Response) => {
    req.session.cart = [];
    res.redirect("/cart/success?message=Cart successfully cleared.");
});

// Route to update the quantity of a product in the cart
router.post("/update", async (req: express.Request, res: express.Response) => {
    const { id, quantity } = req.body;
    const newQuantity = parseInt(quantity);

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const product = req.session.cart.find(
        (item: CartProduct) => item.id === id
    );

    if (product) {
        product.quantity = newQuantity;

        if (product.quantity <= 0) {
            req.session.cart = req.session.cart.filter(
                (item: CartProduct) => item.id !== id
            );
        }
    }

    res.redirect("/cart");
});

// Route to handle the purchase
router.post("/buy", async (req: express.Request, res: express.Response) => {
    const { cart } = req.session;

    if (!cart || cart.length === 0) {
        return res.redirect("/cart/failure?message=Your cart is empty");
    }

    const transaction = await sequelize.transaction();

    try {
        for (const cartProduct of cart) {
            const product = await Product.findOne({
                where: { id: cartProduct.id },
                lock: transaction.LOCK.UPDATE,
                transaction,
            });

            if (!product) {
                throw new Error(`Product not found: ${cartProduct.id}`);
            }

            if (product.quantity < cartProduct.quantity) {
                throw new Error(
                    `Not enough stock for product: ${product.name}.
          Available: ${product.quantity}, requested: ${cartProduct.quantity}`
                );
            }

            product.quantity -= cartProduct.quantity;
            await product.save({ transaction });
        }
        req.session.cart = [];

        await transaction.commit();

        res.redirect("/cart/success?message=Your purchase was successful!");
    } catch (error) {
        await transaction.rollback();

        const message =
            error instanceof Error
                ? error.message
                : "An error occurred during the purchase";

        res.redirect(`/cart/failure?message=${encodeURIComponent(message)}.`);
    }
});

// Route for successful buy
router.get("/success", (req: express.Request, res: express.Response) => {
    const message = req.query.message || "Action completed successfully.";
    res.render("success", { message });
});

// Route for failed buy
router.get("/failure", (req: express.Request, res: express.Response) => {
    const message =
        req.query.message || "Your purchase could not be completed.";
    res.render("failure", { message });
});

export default router;
