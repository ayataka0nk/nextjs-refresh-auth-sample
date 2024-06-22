import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const saltRounds = 10

const main = async () => {
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: '田中 太郎',
      password: await bcrypt.hash('passw0rD', saltRounds)
    }
  })

  await prisma.project.create({
    data: {
      name: 'プロジェクト1',
      description: 'プロジェクト1の説明',
      ownerUserId: user.id
    }
  })

  await prisma.project.create({
    data: {
      name: 'プロジェクト2',
      description: 'プロジェクト2の説明',
      ownerUserId: user.id
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
