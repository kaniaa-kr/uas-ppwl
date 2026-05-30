// src/db.ts
// Single source of truth untuk Prisma instance
// Memutus circular import: routes tidak perlu import dari index.ts lagi

import { getPrisma } from "../prisma/dbPostgres"

export const prisma = getPrisma()