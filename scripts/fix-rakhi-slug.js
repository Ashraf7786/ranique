const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: 'festival Rakhi' }
  });

  if (category) {
    await prisma.category.update({
      where: { id: category.id },
      data: { slug: 'rakhi' }
    });
    console.log("Successfully updated Rakhi category slug to 'rakhi'.");
  } else {
    console.log("Rakhi category with slug 'festival Rakhi' not found (it might already be updated).");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
