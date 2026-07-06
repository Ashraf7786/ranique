const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Found users:', users.map(u => u.email));
  
  if (users.length > 0) {
    const result = await prisma.user.updateMany({
      data: { role: 'ADMIN' }
    });
    console.log(`Promoted ${result.count} users to ADMIN.`);
  } else {
    console.log('No users found in the database. Please register an account first.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
