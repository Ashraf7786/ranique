const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();

  if (users.length === 0 || products.length === 0) {
    console.error("Please ensure you have at least one user and one product in the database before seeding orders.");
    return;
  }

  const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

  console.log('Clearing existing orders for a fresh seed...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  console.log('Generating 30 days of randomized orders...');

  let totalOrdersCreated = 0;
  let totalRevenueGenerated = 0;

  // Generate for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random number of orders per day: between 2 and 12
    const numOrders = Math.floor(Math.random() * 11) + 2;

    for (let j = 0; j < numOrders; j++) {
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Random number of items in this order: between 1 and 4
      const numItems = Math.floor(Math.random() * 4) + 1;
      
      let orderTotal = 0;
      const orderItems = [];

      for (let k = 0; k < numItems; k++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = product.sellingPrice || product.originalPrice || Math.floor(Math.random() * 5000) + 1000;
        
        orderTotal += price * quantity;
        orderItems.push({
          productId: product.id,
          sku: product.sku,
          quantity,
          price
        });
      }

      // Add variation to timestamp within the same day
      const orderDate = new Date(date);
      orderDate.setHours(Math.floor(Math.random() * 24));
      orderDate.setMinutes(Math.floor(Math.random() * 60));

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      await prisma.order.create({
        data: {
          userId: user.id,
          status,
          totalAmount: orderTotal,
          createdAt: orderDate,
          items: {
            create: orderItems
          }
        }
      });

      totalOrdersCreated++;
      totalRevenueGenerated += orderTotal;
    }
  }

  console.log(`Success! Seeded ${totalOrdersCreated} orders generating ₹${totalRevenueGenerated.toLocaleString()} in revenue.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
