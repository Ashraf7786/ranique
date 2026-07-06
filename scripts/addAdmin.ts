const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'ranique.official@gmail.com';
  
  const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: {
      email,
      password: randomPassword,
      firstName: 'Ranique',
      lastName: 'Admin',
      isEmailVerified: true,
      role: 'ADMIN'
    }
  });
  
  console.log(`Success! User ${email} is now an ADMIN in the database.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
