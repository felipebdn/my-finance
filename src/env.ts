import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  CALLBACK_URL_AUTH: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
