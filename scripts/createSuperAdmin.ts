const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'ashrafbillionare2027@gmail.com';
  const plainPassword = '180126';
  
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      role: 'ADMIN',
      password: hashedPassword 
    },
    create: {
      email,
      password: hashedPassword,
      firstName: 'Ashraf',
      lastName: 'Admin',
      isEmailVerified: true,
      role: 'ADMIN'
    }
  });
  
  console.log(`Success! Admin user ${email} created with the requested credentials.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
