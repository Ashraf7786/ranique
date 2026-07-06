const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const payload = {
      title: 'Lip Gloss',
      slug: 'lip-gloss',
      shortDescription: 'HS skhdias df hask f',
      sku: '13162F',
      sellingPrice: NaN,
      originalPrice: null,
      currentStock: NaN,
      status: 'PUBLISHED',
      categoryId: '6696ab3c-b11d-40c5-a87d-b3e253672fe4',
      colors: null
    };

    const product = await prisma.product.create({
      data: {
        ...payload,
        images: {
          create: []
        }
      }
    });
    console.log("Success", product);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
