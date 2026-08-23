const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orderId = '614752D9'; // We can do a findFirst or findUnique with startsWith or exact ID.
  console.log('Searching for order containing ID pattern:', orderId);
  
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const matchingOrder = orders.find(o => o.id.toLowerCase().includes(orderId.toLowerCase()));
  if (!matchingOrder) {
    console.log('No order found matching:', orderId);
    console.log('Available orders in DB:');
    orders.forEach(o => console.log(`- ID: ${o.id}, Name: ${o.shippingName}, Zip: ${o.shippingZip}, Status: ${o.status}`));
    return;
  }

  console.log('Found matching order:');
  console.log(JSON.stringify(matchingOrder, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
