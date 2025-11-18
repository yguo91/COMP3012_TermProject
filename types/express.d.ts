import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    // Use Prisma's User type directly
    interface User extends PrismaUser {}
  }
}

export {};
