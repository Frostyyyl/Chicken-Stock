import Product, { sequelize } from './models/product';

(async () => {
  try {
    await sequelize.sync({ force: true });

    const marans = await Product.create({
      name: 'Marans',
      price: 9.99,
      quantity: 17,
      imageUrl: '/images/marans.jpeg',
      description: 'Chicken breed known for its dark brown eggs.',
    });

    const wyandotte = await Product.create({
      name: 'Wyandotte',
      price: 20.49,
      quantity: 5,
      imageUrl: '/images/wyandotte.jpeg',
      description: 'Chicken breed known for its beautiful plumage.',
    });

    const chabo = await Product.create({
      name: 'Chabo',
      price: 15.19,
      quantity: 10,
      imageUrl: '/images/chabo.jpeg',
      description: 'A small breed of chicken known for its friendly nature.',
    });

    const cochin = await Product.create({
      name: 'Cochin',
      price: 12.99,
      quantity: 8,
      imageUrl: '/images/cochin.jpeg',
      description: 'A large breed of chicken known for its fluffy feathers.',
    });

    const silkie = await Product.create({
      name: 'Silkie',
      price: 14.99,
      quantity: 12,
      imageUrl: '/images/silkie.jpeg',
      description:
        'A breed of chicken known for its fluffy plumage and friendly temperament.',
    });

    const leghorn = await Product.create({
      name: 'Leghorn',
      price: 11.99,
      quantity: 20,
      imageUrl: '/images/leghorn.jpeg',
      description: 'A breed of chicken known for its high egg production.',
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close();
  }
})();
