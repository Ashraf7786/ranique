const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STORE_SLUGS = ['cosmetics', 'skincare', 'accessories', 'bangles', 'purses', 'earing', 'festival Rakhi'];

async function main() {
  // Update all categories that are not in STORE_SLUGS to have storeType = 'CLOTHING'
  const result = await prisma.category.updateMany({
    where: {
      slug: {
        notIn: STORE_SLUGS
      }
    },
    data: {
      storeType: 'CLOTHING'
    }
  });
  console.log(`Successfully updated ${result.count} categories to storeType = 'CLOTHING'.`);

  // Let's also ensure the main STORE categories have storeType = 'STORE'
  const storeResult = await prisma.category.updateMany({
    where: {
      slug: {
        in: STORE_SLUGS
      }
    },
    data: {
      storeType: 'STORE'
    }
  });
  console.log(`Successfully verified ${storeResult.count} categories as storeType = 'STORE'.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
