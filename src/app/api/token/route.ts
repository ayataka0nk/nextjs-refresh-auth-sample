import bcrypt from 'bcrypt'
import { prisma } from '@/prisma'
import { z } from 'zod'
import { SchemaValidationErrorBag } from '@/lib/SchemaValidationError'
import { createToken } from '../lib/session'

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const validated = LoginFormSchema.parse({
      email: email,
      password: password
    })
    const user = await prisma.user.findUnique({
      where: {
        email: validated.email
      }
    })
    if (!user) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    const valid = await bcrypt.compare(validated.password, user.password)
    if (!valid) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    const token = createToken({ userId: user.id })
    return Response.json({
      accessToken: token
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorBag = new SchemaValidationErrorBag('Validation Failed', error)
      return Response.json(
        {
          messsage: 'Validation Failed',
          errors: {
            email: errorBag.getError('email'),
            password: errorBag.getError('password')
          }
        },
        { status: 422 }
      )
    } else {
      throw error
    }
  }
}
