import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Harus di isi' }),
    password: z.string().min(1, { message: 'Harus di isi' }),
    fullname: z.string().min(1, { message: 'Harus di isi' }),
})

export type LoginForm = z.infer<typeof loginSchema>
