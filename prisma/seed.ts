import { PrismaClient } from '../src/generated/prisma'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@proparking.gr' },
    update: {},
    create: {
      email: 'admin@proparking.gr',
      password: hashedPassword,
      name: 'Pro Parking Admin',
      role: 'ADMIN',
      phone: '6900000000'
    },
  })
  
  console.log("Admin user seeded:", admin.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
