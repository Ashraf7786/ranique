const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log("Current Categories in DB:");
  console.log(categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, storeType: c.storeType, isVisible: c.isVisible })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
