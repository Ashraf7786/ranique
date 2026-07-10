import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'ranique.official@gmail.com';
  const newPassword = 'Ranique@Admin2026';

  const hashed = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { password: hashed },
    select: { id: true, email: true, role: true },
  });

  console.log('✅ Password reset successfully!');
  console.log('Email   :', user.email);
  console.log('Role    :', user.role);
  console.log('New Pass: Ranique@Admin2026');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
