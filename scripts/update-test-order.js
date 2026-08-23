const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orderIdPattern = '614752D9';
  console.log('Finding test order...');
  
  const orders = await prisma.order.findMany();
  const order = orders.find(o => o.id.toLowerCase().includes(orderIdPattern.toLowerCase()));

  if (!order) {
    console.error('Test order not found in DB!');
    return;
  }

  console.log('Updating order details to a valid serviceable Indian address:');
  console.log('Current Zip:', order.shippingZip);
  console.log('Current Phone:', order.shippingPhone);

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      shippingName: 'Ashraf Siddiqui',
      shippingPhone: '9567812345', // Realistic Indian mobile number (not sequential)
      shippingLine1: 'D 58/12, Sigra Crossing',
      shippingLine2: 'Near Sigra Stadium',
      shippingCity: 'Varanasi',
      shippingState: 'Uttar Pradesh',
      shippingZip: '221001', // Valid, highly serviceable Varanasi PIN code
      shippingCountry: 'India',
      deliveryAwb: null, // Reset AWB to null so we can test manifesting
      deliveryStatus: 'PENDING',
      deliveryLabelUrl: null
    }
  });

  console.log('Successfully updated order in Neon database:');
  console.log(JSON.stringify(updated, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
