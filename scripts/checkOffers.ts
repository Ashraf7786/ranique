import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const offers = await prisma.productOffer.findMany({
    include: { product: true }
  });
  console.log(JSON.stringify(offers, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
