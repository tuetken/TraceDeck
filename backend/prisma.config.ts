import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

config()

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
