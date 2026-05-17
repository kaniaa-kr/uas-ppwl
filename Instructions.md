# 📸 Instagram Clone — Panduan Lengkap Pengerjaan Capstone

> **Mata Kuliah:** Pemrograman Web Lanjut  
> **Tipe Proyek:** Monorepo (Bun + TypeScript)  
> **Stack:** React · ElysiaJS · Prisma · PostgreSQL (AWS RDS) · AWS S3 + Lambda  
> **Tim:** 5 Orang  
> **Target Minggu Ini (Minggu 15):** Auth · Beranda · Komentar · Notifikasi · ERD Database

---

## 📑 Daftar Isi

1. [Struktur Tim](#1-struktur-tim)
2. [Struktur Folder Proyek](#2-struktur-folder-proyek)
3. [Alur Kerja Git (Wajib Dibaca Semua)](#3-alur-kerja-git-wajib-dibaca-semua)
4. [Setup Awal Proyek — Kania (DevOps)](#4-setup-awal-proyek--kania-devops)
5. [Panduan Kharizma — Auth](#5-panduan-kharizma--auth)
6. [Panduan Evan — Beranda](#6-panduan-evan--beranda)
7. [Panduan Tesa — Komentar](#7-panduan-tesa--komentar)
8. [Panduan Sidiq — Notifikasi](#8-panduan-sidiq--notifikasi)
9. [Environment Variables](#9-environment-variables)
10. [Testing Lokal Sebelum Deploy](#10-testing-lokal-sebelum-deploy)
11. [Panduan Deploy AWS](#11-panduan-deploy-aws)
12. [Checklist Pengumpulan](#12-checklist-pengumpulan)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Struktur Tim

| Nama | Role | Branch | Tanggung Jawab |
|------|------|--------|----------------|
| **Kania** | DevOps + Database | `feat/setup-devops` | Setup monorepo, Prisma schema, seed dummy data, ERD diagram, deploy AWS |
| **Kharizma** | Backend + Frontend Auth | `feat/auth` | Endpoint login/register, Zustand store, halaman Login/Register, ProtectedRoute |
| **Evan** | Backend + Frontend Beranda | `feat/beranda` | Endpoint GET /posts, halaman Homepage, Navbar, card postingan, styling |
| **Tesa** | Backend + Frontend Komentar | `feat/komentar` | Endpoint GET /comments, halaman detail post, section komentar |
| **Sidiq** | Backend + Frontend Notifikasi | `feat/notifikasi` | Endpoint GET /notifications, halaman notif, notification store, Sonner popup |

---

## 2. Struktur Folder Proyek

```
instagram-clone/
├── apps/
│   ├── frontend/                  # Vite + React + Tailwind + ShadCN
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx          (Kharizma)
│   │   │   │   ├── RegisterPage.tsx       (Kharizma)
│   │   │   │   ├── HomePage.tsx           (Evan)
│   │   │   │   ├── PostDetailPage.tsx     (Tesa)
│   │   │   │   └── NotificationPage.tsx   (Sidiq)
│   │   │   ├── components/
│   │   │   │   ├── Navbar.tsx             (Evan)
│   │   │   │   ├── PostCard.tsx           (Evan)
│   │   │   │   ├── CommentItem.tsx        (Tesa)
│   │   │   │   └── ProtectedRoute.tsx     (Kharizma)
│   │   │   ├── stores/
│   │   │   │   ├── auth.store.ts          (Kharizma)
│   │   │   │   └── notification.store.ts  (Sidiq)
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── .env.local
│   │   └── package.json
│   │
│   └── backend/                   # ElysiaJS + Prisma
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts        (Kharizma)
│       │   │   ├── posts.ts       (Evan)
│       │   │   ├── comments.ts    (Tesa)
│       │   │   └── notifications.ts (Sidiq)
│       │   └── index.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── .env
│       └── package.json
│
├── package.json                   # Root workspace
└── README.md
```

---

## 3. Alur Kerja Git (Wajib Dibaca Semua)

### 3.1 — Setup Pertama Kali (Sekali Saja)

```bash
# Clone repo dari GitHub
git clone https://github.com/kaniaa-kr/uas-ppwl.git
cd uas-ppwl

# Pastikan kamu di branch main yang terbaru
git checkout main
git pull origin main

# Buat branch kamu sendiri sesuai peran
# Kania:
git checkout -b feat/setup-devops
# Kharizma:
git checkout -b feat/auth
# Evan:
git checkout -b feat/beranda
# Tesa:
git checkout -b feat/komentar
# Sidiq:
git checkout -b feat/notifikasi

# Verifikasi kamu di branch yang benar
git branch
# * feat/auth   ← harus ada tanda bintang
```

### 3.2 — Rutinitas Harian Setiap Mau Kerja

```bash
# LANGKAH 1: Masuk ke branch kamu
git checkout feat/auth   # ganti dengan branch kamu

# LANGKAH 2: Ambil update terbaru dari main (PENTING!)
git fetch origin
git merge origin/main
# Jika ada conflict → lihat bagian 3.5

# LANGKAH 3: Mulai coding...

# LANGKAH 4: Setelah selesai coding, simpan
git add .
git commit -m "feat(auth): tambah endpoint login dan halaman LoginPage"

# LANGKAH 5: Push ke GitHub
git push origin feat/auth
```

### 3.3 — Format Pesan Commit yang Benar

```
Format: tipe(scope): deskripsi singkat

Contoh:
✅ feat(auth): tambah endpoint register
✅ feat(auth): buat halaman LoginPage dan RegisterPage
✅ fix(beranda): post tidak muncul saat reload
✅ style(navbar): fix padding mobile
✅ refactor(auth): pisah validasi ke fungsi sendiri
```

### 3.4 — Membuat Pull Request (PR) ke Main

Setelah fitur selesai dan di-push:

1. Buka GitHub repo → tab **"Pull requests"**
2. Klik **"New pull request"**
3. Set **base: main** ← **compare: feat/auth** (branch kamu)
4. Isi judul PR:
   ```
   feat(auth): Login, Register, Zustand store, ProtectedRoute
   ```
5. Di deskripsi PR, tulis:
   ```markdown
   ## Yang Dikerjakan
   - Endpoint POST /auth/register
   - Endpoint POST /auth/login
   - Endpoint GET /users?key=secret
   - Halaman LoginPage.tsx
   - Halaman RegisterPage.tsx
   - Zustand auth.store.ts dengan persist
   - Component ProtectedRoute.tsx

   ## Cara Test
   1. Backend: POST /auth/register dengan body
      { "name": "Test", "username": "test", "email": "test@mail.com", "password": "123456" }
   2. Seharusnya dapat response dengan user + JWT token
   3. Login: POST /auth/login dengan { "email": "test@mail.com", "password": "123456" }
   4. Frontend: Buka http://localhost:5173 → lihat login form
   5. Daftar user baru → seharusnya redirect ke beranda

   ## Testing Checklist
   - [x] Register user baru
   - [x] Login berhasil, dapat token
   - [x] Redirect ke beranda
   - [x] Toast "Selamat Datang" muncul
   - [x] Login state tersimpan di localStorage
   - [x] Refresh page tetap login
   - [x] Logout clear state, redirect login
   ```
6. **Request review dari 1 anggota tim lain**
7. Setelah di-approve → **Merge pull request**

### 3.5 — Handle Conflict

Jika ada conflict saat merge:

```bash
# Git akan bilang ada conflict
# CONFLICT (content): Merge conflict in apps/backend/src/index.ts

# Buka file tersebut, cari:
<<<<<<< HEAD
// kode kamu
=======
// kode dari main
>>>>>>> origin/main

# Pilih mana yang benar (atau gabungkan), hapus tanda <<<, ===, >>>
git add apps/backend/src/index.ts
git commit -m "fix: resolve merge conflict di index.ts"
git push origin feat/auth
```

### 3.6 — Aturan Branch Final

```
main (utama, production-ready)
  ├── feat/setup-devops   (Kania)
  ├── feat/auth           (Kharizma)
  ├── feat/beranda        (Evan)
  ├── feat/komentar       (Tesa)
  └── feat/notifikasi     (Sidiq)
```

> ⚠️ **JANGAN** commit langsung ke main. Semua harus via PR.

---

## 4. Setup Awal Proyek — Kania (DevOps)

> **Kania kerjakan ini DULUAN sebelum anggota lain mulai.** Setelah selesai, push ke main agar semua bisa clone dan langsung kerja.

### 4.1 — Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell as Admin)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verifikasi
bun --version
```

### 4.2 — Inisialisasi Monorepo

```bash
mkdir instagram-clone && cd instagram-clone
git init

# Root package.json
cat > package.json << 'EOF'
{
  "name": "instagram-clone",
  "version": "1.0.0",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:fe": "bun --cwd apps/frontend dev",
    "dev:be": "bun --cwd apps/backend dev",
    "dev": "concurrently \"bun dev:be\" \"bun dev:fe\""
  }
}
EOF

# .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
.DS_Store
*.log
.turbo/
.next/
EOF

mkdir -p apps packages
```

### 4.3 — Setup Backend (ElysiaJS)

```bash
cd apps
mkdir backend && cd backend
bun init -y

# Dependencies
bun add elysia @elysiajs/cors @elysiajs/jwt
bun add prisma @prisma/client @prisma/adapter-pg pg
bun add bcryptjs jsonwebtoken dotenv
bun add -d @types/bcryptjs @types/jsonwebtoken

# Init Prisma
bunx prisma init
```

### 4.4 — Prisma Schema Lengkap

Edit `apps/backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= USER TABLE =============
model User {
  id               BigInt    @id @default(autoincrement())
  name             String
  username         String    @unique
  email            String    @unique
  password         String?                    // NULL jika OAuth-only
  avatar_url       String?
  bio              String?
  provider         String    @default("email")  // "email" | "google"
  provider_id      String?                    // ID dari Google OAuth
  email_verified_at DateTime?
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  // Relations
  posts            Post[]
  comments         Comment[]
  likes            PostLike[]
  notifications    Notification[] @relation("receiver")
  actions          Notification[] @relation("actor")
}

// ============= POST TABLE =============
model Post {
  id            BigInt    @id @default(autoincrement())
  user_id       BigInt
  content       String
  image_url     String?
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  user          User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  comments      Comment[]
  likes         PostLike[]
  notifications Notification[]

  @@index([user_id])
}

// ============= COMMENT TABLE =============
model Comment {
  id            BigInt    @id @default(autoincrement())
  post_id       BigInt
  user_id       BigInt
  content       String
  created_at    DateTime  @default(now())
  updated_at    DateTime  @updatedAt

  post          Post      @relation(fields: [post_id], references: [id], onDelete: Cascade)
  user          User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  notifications Notification[]

  @@index([post_id])
  @@index([user_id])
}

// ============= POST_LIKE TABLE =============
model PostLike {
  id         BigInt   @id @default(autoincrement())
  post_id    BigInt
  user_id    BigInt
  created_at DateTime @default(now())

  post       Post     @relation(fields: [post_id], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@unique([post_id, user_id])
  @@index([user_id])
}

// ============= NOTIFICATION TABLE =============
model Notification {
  id         BigInt   @id @default(autoincrement())
  user_id    BigInt                        // Penerima notif
  actor_id   BigInt                        // Pelaku aksi
  type       String                        // "like" | "comment"
  post_id    BigInt?
  comment_id BigInt?
  is_read    Boolean  @default(false)
  created_at DateTime @default(now())

  user       User     @relation("receiver", fields: [user_id], references: [id], onDelete: Cascade)
  actor      User     @relation("actor", fields: [actor_id], references: [id], onDelete: Cascade)
  post       Post?    @relation(fields: [post_id], references: [id], onDelete: SetNull)
  comment    Comment? @relation(fields: [comment_id], references: [id], onDelete: SetNull)

  @@index([user_id])
  @@index([actor_id])
}
```

### 4.5 — Migrasi Database

```bash
cd apps/backend

# Pastikan DATABASE_URL sudah benar di .env
cat .env

# Jalankan migrasi
bunx prisma migrate dev --name init

# Setup Prisma Studio (optional, untuk visual debugging)
bunx prisma studio
```

### 4.6 — Seed Data Dummy Lengkap

Buat `apps/backend/prisma/seed.ts`:

```typescript
import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di .env!")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Mulai seeding data dummy...")

  // Hapus data lama
  await prisma.notification.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash("password123", 10)

  // ===== USERS DUMMY =====
  console.log("📝 Membuat users...")
  
  const user1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      username: "budi_santoso",
      email: "budi@test.com",
      password: hashedPassword,
      avatar_url: "https://i.pravatar.cc/150?img=1",
      bio: "Suka kopi dan ngoding ☕",
      provider: "email",
      provider_id: null,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: "Siti Rahayu",
      username: "siti_rahayu",
      email: "siti@test.com",
      password: hashedPassword,
      avatar_url: "https://i.pravatar.cc/150?img=2",
      bio: "Pecinta kucing 🐱",
      provider: "email",
      provider_id: null,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: "Ahmad Fauzi",
      username: "ahmad_fauzi",
      email: "ahmad@test.com",
      password: null,
      avatar_url: "https://i.pravatar.cc/150?img=3",
      bio: "Web developer & coffee enthusiast",
      provider: "google",
      provider_id: "google_id_dummy_123",
    },
  })

  console.log("✅ Users created: 3")

  // ===== POSTS DUMMY =====
  console.log("📝 Membuat posts...")

  const post1 = await prisma.post.create({
    data: {
      user_id: user1.id,
      content: "Hari pertama coding pakai ElysiaJS, ternyata cepet banget! ⚡ Framework ini benar-benar game changer.",
      image_url: "https://picsum.photos/seed/post1/600/400",
    },
  })

  const post2 = await prisma.post.create({
    data: {
      user_id: user2.id,
      content: "Sunset sore ini di Bandung, cantik banget 🌅 Nature photography is the best!",
      image_url: "https://picsum.photos/seed/post2/600/400",
    },
  })

  const post3 = await prisma.post.create({
    data: {
      user_id: user3.id,
      content: "Tips belajar React: mulai dari yang kecil, build terus sampai terbiasa 💪 Consistency is key!",
      image_url: null,
    },
  })

  console.log("✅ Posts created: 3")

  // ===== COMMENTS DUMMY =====
  console.log("📝 Membuat comments...")

  const comment1 = await prisma.comment.create({
    data: {
      post_id: post1.id,
      user_id: user2.id,
      content: "Wah beneran? Harus coba nih ElysiaJS!",
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      post_id: post1.id,
      user_id: user3.id,
      content: "ElysiaJS emang mantap, performanya top 🔥",
    },
  })

  const comment3 = await prisma.comment.create({
    data: {
      post_id: post2.id,
      user_id: user1.id,
      content: "Indah banget! Kapan ke sana lagi?",
    },
  })

  console.log("✅ Comments created: 3")

  // ===== LIKES DUMMY =====
  console.log("📝 Membuat likes...")

  await prisma.postLike.createMany({
    data: [
      { post_id: post1.id, user_id: user2.id },
      { post_id: post1.id, user_id: user3.id },
      { post_id: post2.id, user_id: user1.id },
      { post_id: post2.id, user_id: user3.id },
      { post_id: post3.id, user_id: user1.id },
      { post_id: post3.id, user_id: user2.id },
    ],
  })

  console.log("✅ Likes created: 6")

  // ===== NOTIFICATIONS DUMMY =====
  console.log("📝 Membuat notifications...")

  await prisma.notification.createMany({
    data: [
      // Budi (pemilik post1) dapat notif dari Siti (comment)
      {
        user_id: user1.id,
        actor_id: user2.id,
        type: "comment",
        post_id: post1.id,
        comment_id: comment1.id,
        is_read: false,
      },
      // Budi dapat notif dari Ahmad (comment)
      {
        user_id: user1.id,
        actor_id: user3.id,
        type: "comment",
        post_id: post1.id,
        comment_id: comment2.id,
        is_read: false,
      },
      // Budi dapat notif dari Siti (like post1)
      {
        user_id: user1.id,
        actor_id: user2.id,
        type: "like",
        post_id: post1.id,
        is_read: true,
      },
      // Siti (pemilik post2) dapat notif dari Budi (comment)
      {
        user_id: user2.id,
        actor_id: user1.id,
        type: "comment",
        post_id: post2.id,
        comment_id: comment3.id,
        is_read: false,
      },
      // Siti dapat notif dari Budi (like post2)
      {
        user_id: user2.id,
        actor_id: user1.id,
        type: "like",
        post_id: post2.id,
        is_read: false,
      },
    ],
  })

  console.log("✅ Notifications created: 5")
  console.log("🎉 Seeding selesai dengan sukses!")
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
```

Update `apps/backend/package.json`:

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "db:migrate": "bunx prisma migrate dev",
    "db:seed": "bunx prisma db seed",
    "db:studio": "bunx prisma studio",
    "db:reset": "bunx prisma migrate reset"
  },
  "prisma": {
    "seed": "bun run prisma/seed.ts"
  }
}
```

Jalankan seed:

```bash
cd apps/backend
bun run db:seed
```

### 4.7 — Backend Entry Point (index.ts)

Buat `apps/backend/src/index.ts`:

```typescript
import "dotenv/config"
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { authRoutes } from "./routes/auth"
import { postRoutes } from "./routes/posts"
import { commentRoutes } from "./routes/comments"
import { notifRoutes } from "./routes/notifications"

// Setup Prisma dengan adapter PostgreSQL (wajib Prisma v7)
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di .env!")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prisma = new PrismaClient({ adapter })

const app = new Elysia()
  .use(cors({ origin: "*" }))
  .use(authRoutes)
  .use(postRoutes)
  .use(commentRoutes)
  .use(notifRoutes)

  // Endpoint khusus untuk dosen/asisten check data
  .get("/users", async ({ query, set }) => {
    if (query.key !== process.env.SECRET_KEY) {
      set.status = 401
      return { error: "Unauthorized" }
    }
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        provider: true,
        created_at: true,
      },
    })
  })

  // Health check endpoint
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date(),
    message: "Backend is running!",
  }))

  .listen(process.env.PORT || 3000)

console.log(`🦊 Backend berjalan di http://localhost:${app.server?.port}`)
```

### 4.8 — Setup Frontend

```bash
cd apps
bun create vite frontend --template react-ts
cd frontend
bun install

# Main dependencies
bun add zustand @tanstack/react-query react-router-dom axios
bun add sonner lucide-react

# Tailwind
bun add -d tailwindcss postcss autoprefixer
bunx tailwindcss init -p

# ShadCN
bunx shadcn@latest init
# Pilih: Default style, Slate color, CSS variables: yes
bunx shadcn@latest add button input card avatar badge sonner
```

### 4.9 — Setup Frontend Config

Edit `apps/frontend/tailwind.config.js`:

```js
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Edit `apps/frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4.10 — Create Stub Route Files (Temporary)

Buat file-file route kosong untuk setiap orang:

```bash
mkdir -p apps/backend/src/routes

# Auth routes (Kharizma akan update)
cat > apps/backend/src/routes/auth.ts << 'EOF'
import { Elysia } from "elysia"
export const authRoutes = new Elysia({ prefix: "/auth" })
  .get("/", () => ({ message: "Auth routes - TODO" }))
EOF

# Posts routes (Evan akan update)
cat > apps/backend/src/routes/posts.ts << 'EOF'
import { Elysia } from "elysia"
export const postRoutes = new Elysia({ prefix: "/posts" })
  .get("/", () => ({ message: "Posts routes - TODO" }))
EOF

# Comments routes (Tesa akan update)
cat > apps/backend/src/routes/comments.ts << 'EOF'
import { Elysia } from "elysia"
export const commentRoutes = new Elysia({ prefix: "/comments" })
  .get("/", () => ({ message: "Comments routes - TODO" }))
EOF

# Notifications routes (Sidiq akan update)
cat > apps/backend/src/routes/notifications.ts << 'EOF'
import { Elysia } from "elysia"
export const notifRoutes = new Elysia({ prefix: "/notifications" })
  .get("/", () => ({ message: "Notifications routes - TODO" }))
EOF
```

### 4.11 — Environment Files

Buat `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/instagram_clone"
JWT_SECRET="secret-dev-minggu-15-ppwl"
SECRET_KEY="rahasia-dosen-123"
PORT=3000
```

Buat `apps/frontend/.env.local`:

```env
VITE_API_URL="http://localhost:3000"
```

### 4.12 — ERD Diagram

Buat folder `docs/` dan file `docs/ERD.md`:

```markdown
# Entity Relationship Diagram (ERD)

## Database Schema

```
┌──────────────────┐
│     users        │
├──────────────────┤
│ id (PK)          │
│ name             │
│ username (UNIQUE)│
│ email (UNIQUE)   │
│ password (NULL)  │
│ avatar_url       │
│ bio              │
│ provider         │
│ provider_id      │
│ created_at       │
│ updated_at       │
└──────────────────┘
        │
        │ 1:N
        ├─────────────────────┬────────────────────┬─────────────────┐
        │                     │                    │                 │
    ┌───────────┐        ┌────────────┐    ┌──────────────┐   ┌──────────────┐
    │   posts   │        │  comments  │    │  post_likes  │   │notifications │
    ├───────────┤        ├────────────┤    ├──────────────┤   ├──────────────┤
    │ id (PK)   │        │ id (PK)    │    │ id (PK)      │   │ id (PK)      │
    │ user_id   │←───────│ user_id    │    │ user_id      │   │ user_id (FK) │
    │ content   │        │ post_id    │    │ post_id      │   │ actor_id(FK) │
    │ image_url │        │ content    │    │ created_at   │   │ type         │
    │ created_at│        │ created_at │    └──────────────┘   │ post_id (FK) │
    │ updated_at│        │ updated_at │                       │ comment_id   │
    └───────────┘        └────────────┘                       │ is_read      │
        │                     │                               │ created_at   │
        │                     │                               └──────────────┘
        └─────────────────────┘
                │
                │ M:N (via post_likes)
```

## Relasi Tabel

- **Users** → **Posts**: 1 user dapat memiliki banyak posts (1:N)
- **Users** → **Comments**: 1 user dapat memiliki banyak comments (1:N)
- **Users** → **PostLikes**: 1 user dapat like banyak posts (1:N)
- **Users** → **Notifications**: 1 user dapat menerima banyak notifikasi (1:N)
- **Posts** → **Comments**: 1 post dapat memiliki banyak comments (1:N)
- **Posts** → **PostLikes**: 1 post dapat dilike banyak users (1:N)
- **Posts** → **Notifications**: 1 post dapat memicu banyak notifikasi (1:N)
- **Comments** → **Notifications**: 1 comment dapat memicu notifikasi (1:N)

## Constraints

- `PostLike`: UNIQUE(post_id, user_id) — user tidak bisa like post lebih dari 1x
- `User.email`: UNIQUE — tidak boleh email duplikat
- `User.username`: UNIQUE — tidak boleh username duplikat
- OnDelete Cascade: jika user/post dihapus, comments/likes/notifs ikut terhapus
```

### 4.13 — Push ke GitHub

```bash
cd instagram-clone
git add .
git commit -m "chore(setup): init monorepo, prisma schema, seed data, backend entry"
git branch -M main
git remote add origin https://github.com/kaniaa-kr/uas-ppwl.git
git push -u origin main

# Beritahu anggota tim lain bahwa repo sudah siap
echo "✅ Repo siap! Anggota lain bisa clone dan mulai kerja"
```

---

## 5. Panduan Kharizma — Auth

> **Kharizma** handle auth di backend & frontend. Ini adalah foundation untuk semua fitur lain, jadi pastikan test dengan teliti.

### 5.1 — Clone & Setup Branch

```bash
git clone https://github.com/kaniaa-kr/uas-ppwl.git
cd uas-ppwl

# Pastikan Kania sudah push ke main
git checkout main
git pull origin main

# Buat branch kamu
git checkout -b feat/auth

# Install dependencies
bun install
cd apps/backend && bun install
cd ../frontend && bun install
```

### 5.2 — Backend: Auth Routes

Kharizma update file `apps/backend/src/routes/auth.ts`:

```typescript
import { Elysia, t } from "elysia"
import { prisma } from "../index"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret-dev"

export const authRoutes = new Elysia({ prefix: "/auth" })

  // ====== POST /auth/register ======
  .post(
    "/register",
    async ({ body, set }) => {
      const { name, username, email, password } = body

      // Validasi: email sudah ada?
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      })
      if (existingEmail) {
        set.status = 400
        return { error: "Email sudah terdaftar" }
      }

      // Validasi: username sudah ada?
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      })
      if (existingUsername) {
        set.status = 400
        return { error: "Username sudah dipakai" }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Buat user baru
      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          provider: "email",
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          avatar_url: true,
        },
      })

      // Generate JWT
      const token = jwt.sign(
        { id: user.id.toString() },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      return {
        message: "Register berhasil",
        user: {
          ...user,
          id: user.id.toString(),
        },
        accessToken: token,
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2 }),
        username: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )

  // ====== POST /auth/login ======
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body

      // Cari user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        set.status = 401
        return { error: "Email atau password salah" }
      }

      // Validasi password
      const passwordValid = await bcrypt.compare(password, user.password)
      if (!passwordValid) {
        set.status = 401
        return { error: "Email atau password salah" }
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id.toString() },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      return {
        message: "Login berhasil",
        user: {
          id: user.id.toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
        },
        accessToken: token,
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )

  // ====== GET /auth/me (Optional, verify token) ======
  .get(
    "/me",
    async ({ headers, set }) => {
      const auth = headers.authorization
      if (!auth) {
        set.status = 401
        return { error: "Tidak ada token" }
      }

      try {
        const token = auth.replace("Bearer ", "")
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

        const user = await prisma.user.findUnique({
          where: { id: BigInt(decoded.id) },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar_url: true,
          },
        })

        if (!user) {
          set.status = 404
          return { error: "User tidak ditemukan" }
        }

        return { ...user, id: user.id.toString() }
      } catch (e) {
        set.status = 401
        return { error: "Token tidak valid atau sudah expired" }
      }
    }
  )
```

### 5.3 — Test Backend Auth Endpoint

Sebelum ke frontend, test endpoint auth dengan Postman/Thunder Client:

**Test 1: Register User**
```
POST http://localhost:3000/auth/register
Content-Type: application/json

Body:
{
  "name": "Test User",
  "username": "testuser123",
  "email": "test@mail.com",
  "password": "password123"
}

Expected Response (200):
{
  "message": "Register berhasil",
  "user": {
    "id": "1",
    "name": "Test User",
    "username": "testuser123",
    "email": "test@mail.com",
    "avatar_url": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test 2: Login User**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

Body:
{
  "email": "test@mail.com",
  "password": "password123"
}

Expected Response (200):
{
  "message": "Login berhasil",
  "user": {
    "id": "1",
    "name": "Test User",
    "username": "testuser123",
    "email": "test@mail.com",
    "avatar_url": null
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test 3: Get Current User (dengan token)**
```
GET http://localhost:3000/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Expected Response (200):
{
  "id": "1",
  "name": "Test User",
  "username": "testuser123",
  "email": "test@mail.com",
  "avatar_url": null
}
```

### 5.4 — Frontend: Zustand Auth Store

Kharizma buat `apps/frontend/src/stores/auth.store.ts`:

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
  id: string
  name: string
  username: string
  email: string
  avatar_url?: string
}

type AuthStore = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Nama key di localStorage
    }
  )
)
```

### 5.5 — Frontend: Protected Route Component

Kharizma buat `apps/frontend/src/components/ProtectedRoute.tsx`:

```tsx
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

### 5.6 — Frontend: Login Page

Kharizma buat `apps/frontend/src/pages/LoginPage.tsx`:

```tsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Login gagal")
        return
      }

      setAuth(data.user, data.accessToken)
      toast.success(`Selamat Datang, ${data.user.name}! 👋`)
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Terjadi kesalahan, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-4xl mb-2">📸</h1>
          <h2 className="text-2xl font-bold">Instagram Clone</h2>
          <p className="text-gray-500 text-sm mt-1">Minggu 15 PPWL</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? "Sedang masuk..." : "Masuk"}
          </button>
        </div>

        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-xs">atau</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
```

### 5.7 — Frontend: Register Page

Kharizma buat `apps/frontend/src/pages/RegisterPage.tsx`:

```tsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async () => {
    // Validasi
    if (!form.name || !form.username || !form.email || !form.password) {
      toast.error("Semua field wajib diisi")
      return
    }

    if (form.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Registrasi gagal")
        return
      }

      setAuth(data.user, data.accessToken)
      toast.success(
        `Akun berhasil dibuat! Selamat datang, ${data.user.name}! 🎉`
      )
      navigate("/")
    } catch (error) {
      console.error("Register error:", error)
      toast.error("Terjadi kesalahan, coba lagi")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm mt-1">Bergabung dengan kami</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            name="name"
            type="text"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="username"
            type="text"
            placeholder="Username (tanpa spasi)"
            value={form.username}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
          >
            {loading ? "Sedang mendaftar..." : "Daftar"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
```

### 5.8 — Frontend: App.tsx (Basic Routing)

Kharizma update `apps/frontend/src/App.tsx` (sementara, akan dilengkapi oleh orang lain):

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuthStore } from "./stores/auth.store"

// Placeholder components untuk orang lain
const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">🚧</h1>
      <p className="text-gray-500">Halaman {name} akan disiapkan oleh tim lain</p>
    </div>
  </div>
)

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Beranda" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Detail Post" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Notifikasi" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

### 5.9 — Test Auth Lengkap

Jalankan backend & frontend:

```bash
# Terminal 1: Backend
cd apps/backend
bun run dev
# Output: 🦊 Backend berjalan di http://localhost:3000

# Terminal 2: Frontend
cd apps/frontend
bun run dev
# Output: http://localhost:5173
```

Buka `http://localhost:5173` dan test:

1. ✅ **Test Register:**
   - Klik "Daftar di sini"
   - Isi form: Nama, Username, Email, Password
   - Klik "Daftar"
   - Seharusnya: Toast "Akun berhasil dibuat!", redirect ke halaman beranda (placeholder)

2. ✅ **Test Login:**
   - Klik "Masuk di sini" di halaman register
   - Isi email & password yang tadi
   - Klik "Masuk"
   - Seharusnya: Toast "Selamat Datang, [Nama]!", redirect ke halaman beranda

3. ✅ **Test Logout (nanti, setelah Evan buat Navbar):**
   - Refresh page → seharusnya tetap login (localStorage bekerja)
   - Logout → redirect ke login

### 5.10 — Commit & Push

```bash
git add .
git commit -m "feat(auth): endpoint register/login, Zustand store, halaman Login/Register"
git push origin feat/auth

# Buat PR di GitHub
```

---

## 6. Panduan Evan — Beranda

> **Evan** handle halaman utama setelah login. Ini yang paling visible untuk user.

### 6.1 — Setup Branch (Setelah Kharizma)

```bash
git clone https://github.com/kaniaa-kr/uas-ppwl.git
cd uas-ppwl
git checkout main
git pull origin main
git checkout -b feat/beranda
```

### 6.2 — Backend: GET /posts Route

Evan update `apps/backend/src/routes/posts.ts`:

```typescript
import { Elysia } from "elysia"
import { prisma } from "../index"

export const postRoutes = new Elysia({ prefix: "/posts" })

  // ====== GET /posts ======
  // Ambil semua postingan untuk halaman beranda
  .get("/", async () => {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 20,
    })

    // Convert BigInt ke string agar bisa di-JSON-kan
    return posts.map((p) => ({
      ...p,
      id: p.id.toString(),
      user_id: p.user_id.toString(),
      user: {
        ...p.user,
        id: p.user.id.toString(),
      },
    }))
  })

  // ====== GET /posts/:id ======
  // Ambil detail 1 postingan
  .get("/:id", async ({ params, set }) => {
    const post = await prisma.post.findUnique({
      where: { id: BigInt(params.id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!post) {
      set.status = 404
      return { error: "Post tidak ditemukan" }
    }

    return {
      ...post,
      id: post.id.toString(),
      user_id: post.user_id.toString(),
      user: {
        ...post.user,
        id: post.user.id.toString(),
      },
    }
  })
```

### 6.3 — Frontend: Navbar Component

Evan buat `apps/frontend/src/components/Navbar.tsx`:

```tsx
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth.store"
import { Bell, LogOut, Home } from "lucide-react"
import { toast } from "sonner"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success("Logout berhasil")
    navigate("/login")
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold flex items-center gap-2 hover:opacity-75 transition"
        >
          📸 <span className="text-lg">InstaClone</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Home */}
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-500 transition"
            title="Beranda"
          >
            <Home size={24} />
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="text-gray-600 hover:text-red-500 transition relative"
            title="Notifikasi"
          >
            <Bell size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition">
            <img
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user?.name}`
              }
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-semibold hidden sm:inline">
              {user?.name}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}
```

### 6.4 — Frontend: Post Card Component

Evan buat `apps/frontend/src/components/PostCard.tsx`:

```tsx
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Share2 } from "lucide-react"

type PostCardProps = {
  id: string
  content: string
  image_url?: string
  user: {
    name: string
    username: string
    avatar_url?: string
  }
  likes: number
  comments: number
}

export default function PostCard({
  id,
  content,
  image_url,
  user,
  likes,
  comments,
}: PostCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${user.name}`
          }
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-400">@{user.username}</p>
        </div>
      </div>

      {/* Gambar */}
      {image_url && (
        <img
          src={image_url}
          alt="post"
          className="w-full aspect-square object-cover"
        />
      )}

      {/* Konten */}
      <div className="p-4">
        <p className="text-sm text-gray-800 line-clamp-3">{content}</p>
      </div>

      {/* Footer: Actions */}
      <div className="px-4 pb-4 flex items-center gap-4 text-gray-500 border-t">
        <button className="flex items-center gap-1 hover:text-red-500 transition py-2 flex-1 justify-center">
          <Heart size={20} />
          <span className="text-sm font-semibold">{likes}</span>
        </button>

        <Link
          to={`/post/${id}`}
          className="flex items-center gap-1 hover:text-blue-500 transition py-2 flex-1 justify-center"
        >
          <MessageCircle size={20} />
          <span className="text-sm font-semibold">{comments}</span>
        </Link>

        <button className="flex items-center gap-1 hover:text-green-500 transition py-2 flex-1 justify-center">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  )
}
```

### 6.5 — Frontend: Home Page

Evan buat `apps/frontend/src/pages/HomePage.tsx`:

```tsx
import { useEffect, useState } from "react"
import { Navbar } from "../components"
import PostCard from "../components/PostCard"
import { toast } from "sonner"

type Post = {
  id: string
  content: string
  image_url?: string
  created_at: string
  user: {
    id: string
    name: string
    username: string
    avatar_url?: string
  }
  _count: {
    likes: number
    comments: number
  }
}

const API_URL = import.meta.env.VITE_API_URL

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/posts`)
      if (!res.ok) throw new Error("Gagal fetch posts")
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast.error("Gagal memuat postingan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Pull-to-refresh hint */}
        <div className="text-center text-gray-400 text-xs mb-4">
          📱 Geser ke bawah untuk refresh
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-gray-400">Belum ada postingan</p>
            <p className="text-sm text-gray-300 mt-1">
              Jadilah yang pertama posting!
            </p>
          </div>
        )}

        {/* Posts feed */}
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.content}
              image_url={post.image_url}
              user={post.user}
              likes={post._count.likes}
              comments={post._count.comments}
            />
          ))}
        </div>
      </div>
    </>
  )
}
```

### 6.6 — Update App.tsx (Evan)

Evan update `apps/frontend/src/App.tsx` untuk include homepage:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./components/ProtectedRoute"

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">🚧</h1>
      <p className="text-gray-500">
        Halaman {name} sedang disiapkan oleh tim lain
      </p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Detail Post" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Notifikasi" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

### 6.7 — Test Beranda

```bash
# Terminal 1: Backend
cd apps/backend && bun run dev

# Terminal 2: Frontend
cd apps/frontend && bun run dev

# Buka http://localhost:5173
# 1. Login dengan user dummy dari seed
# 2. Seharusnya lihat 3 postingan di beranda
# 3. Klik post → nanti akan ke halaman detail (placeholder)
# 4. Klik notification icon → nanti akan ke halaman notif (placeholder)
```

### 6.8 — Commit & Push

```bash
git add .
git commit -m "feat(beranda): endpoint GET /posts, halaman HomePage, Navbar, PostCard"
git push origin feat/beranda
```

---

## 7. Panduan Tesa — Komentar

> **Tesa** handle detail post + komentar section. User bisa lihat postingan lengkap dan komentar yang ada.

### 7.1 — Setup Branch

```bash
git clone https://github.com/kaniaa-kr/uas-ppwl.git
cd uas-ppwl
git checkout main
git pull origin main
git checkout -b feat/komentar
```

### 7.2 — Backend: GET /comments Route

Tesa update `apps/backend/src/routes/comments.ts`:

```typescript
import { Elysia } from "elysia"
import { prisma } from "../index"

export const commentRoutes = new Elysia({ prefix: "/comments" })

  // ====== GET /comments/post/:postId ======
  // Ambil semua komentar untuk 1 postingan
  .get("/post/:postId", async ({ params, set }) => {
    const postId = BigInt(params.postId)

    // Validasi: post ada?
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })
    if (!post) {
      set.status = 404
      return { error: "Post tidak ditemukan" }
    }

    // Ambil comments
    const comments = await prisma.comment.findMany({
      where: { post_id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
    })

    return comments.map((c) => ({
      ...c,
      id: c.id.toString(),
      post_id: c.post_id.toString(),
      user_id: c.user_id.toString(),
      user: {
        ...c.user,
        id: c.user.id.toString(),
      },
    }))
  })
```

### 7.3 — Frontend: Comment Item Component

Tesa buat `apps/frontend/src/components/CommentItem.tsx`:

```tsx
import { Trash2 } from "lucide-react"

type CommentItemProps = {
  id: string
  author: {
    name: string
    avatar_url?: string
  }
  content: string
  createdAt: string
  onDelete?: (id: string) => void
  canDelete?: boolean
}

export default function CommentItem({
  id,
  author,
  content,
  createdAt,
  onDelete,
  canDelete = false,
}: CommentItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} menit lalu`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} jam lalu`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} hari lalu`

    return date.toLocaleDateString("id-ID")
  }

  return (
    <div className="flex gap-3 bg-white rounded-lg p-3 border hover:bg-gray-50 transition">
      {/* Avatar */}
      <img
        src={
          author.avatar_url ||
          `https://ui-avatars.com/api/?name=${author.name}`
        }
        alt={author.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-xs">{author.name}</p>
        <p className="text-sm text-gray-700 break-words">{content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(createdAt)}
        </p>
      </div>

      {/* Delete button */}
      {canDelete && onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-600 transition flex-shrink-0"
          title="Hapus komentar"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
```

### 7.4 — Frontend: Post Detail Page

Tesa buat `apps/frontend/src/pages/PostDetailPage.tsx`:

```tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import { Navbar } from "../components"
import CommentItem from "../components/CommentItem"
import { toast } from "sonner"

type Post = {
  id: string
  content: string
  image_url?: string
  user: {
    name: string
    username: string
    avatar_url?: string
  }
  _count: {
    likes: number
    comments: number
  }
}

type Comment = {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    name: string
    avatar_url?: string
  }
}

const API_URL = import.meta.env.VITE_API_URL

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/posts/${id}`),
        fetch(`${API_URL}/comments/post/${id}`),
      ])

      if (!postRes.ok) throw new Error("Post tidak ditemukan")

      const postData = await postRes.json()
      const commentsData = (await commentsRes.json()) || []

      setPost(postData)
      setComments(Array.isArray(commentsData) ? commentsData : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Gagal memuat postingan")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="text-center p-8 text-gray-400">Post tidak ditemukan</div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 mb-4 hover:text-black transition"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        {/* Post detail */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={
                post.user.avatar_url ||
                `https://ui-avatars.com/api/?name=${post.user.name}`
              }
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{post.user.name}</p>
              <p className="text-xs text-gray-400">@{post.user.username}</p>
            </div>
          </div>

          {/* Image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt="post"
              className="w-full aspect-square object-cover"
            />
          )}

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 flex items-center gap-4 text-gray-500 border-t">
            <button className="flex items-center gap-2 hover:text-red-500 transition flex-1 justify-center py-2">
              <Heart size={20} />
              <span className="text-sm">{post._count.likes} suka</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition flex-1 justify-center py-2">
              <MessageCircle size={20} />
              <span className="text-sm">{post._count.comments} komentar</span>
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 transition flex-1 justify-center py-2">
              <Share2 size={20} />
              <span className="text-sm">Bagikan</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        <div>
          <h2 className="font-bold text-lg mb-4">
            Komentar ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Belum ada komentar</p>
              <p className="text-gray-300 text-sm mt-1">Jadilah yang pertama!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  id={comment.id}
                  author={comment.user}
                  content={comment.content}
                  createdAt={comment.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

### 7.5 — Update App.tsx (Tesa)

Tesa update `apps/frontend/src/App.tsx` untuk include PostDetailPage:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import PostDetailPage from "./pages/PostDetailPage"
import ProtectedRoute from "./components/ProtectedRoute"

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">🚧</h1>
      <p className="text-gray-500">
        Halaman {name} sedang disiapkan oleh tim lain
      </p>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="Notifikasi" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

### 7.6 — Test Komentar

```bash
# 1. Login
# 2. Klik post di beranda
# 3. Seharusnya masuk ke halaman detail post
# 4. Lihat komentar dari dummy data
# 5. Kembali ke beranda dengan tombol back
```

### 7.7 — Commit & Push

```bash
git add .
git commit -m "feat(komentar): endpoint GET /comments, halaman PostDetailPage, CommentItem"
git push origin feat/komentar
```

---

## 8. Panduan Sidiq — Notifikasi

> **Sidiq** handle notifikasi. User bisa lihat siapa yang like/comment postingan mereka.

### 8.1 — Setup Branch

```bash
git clone https://github.com/kaniaa-kr/uas-ppwl.git
cd uas-ppwl
git checkout main
git pull origin main
git checkout -b feat/notifikasi
```

### 8.2 — Backend: GET /notifications Route

Sidiq update `apps/backend/src/routes/notifications.ts`:

```typescript
import { Elysia } from "elysia"
import { prisma } from "../index"

export const notifRoutes = new Elysia({ prefix: "/notifications" })

  // ====== GET /notifications/:userId ======
  // Ambil notifikasi untuk user tertentu
  .get("/:userId", async ({ params, set }) => {
    const userId = BigInt(params.userId)

    // Validasi: user ada?
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      set.status = 404
      return { error: "User tidak ditemukan" }
    }

    // Ambil notifikasi
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 30,
    })

    return notifications.map((n) => ({
      ...n,
      id: n.id.toString(),
      user_id: n.user_id.toString(),
      actor_id: n.actor_id.toString(),
      post_id: n.post_id?.toString(),
      comment_id: n.comment_id?.toString(),
      actor: {
        ...n.actor,
        id: n.actor.id.toString(),
      },
      post: n.post
        ? {
            ...n.post,
            id: n.post.id.toString(),
          }
        : null,
    }))
  })

  // ====== PATCH /notifications/:id/read (Optional) ======
  // Tandai notifikasi sudah dibaca
  .patch("/:id/read", async ({ params, set }) => {
    try {
      const notification = await prisma.notification.update({
        where: { id: BigInt(params.id) },
        data: { is_read: true },
      })
      return { success: true, notification }
    } catch {
      set.status = 400
      return { error: "Gagal update notifikasi" }
    }
  })
```

### 8.3 — Frontend: Notification Store

Sidiq buat `apps/frontend/src/stores/notification.store.ts`:

```typescript
import { create } from "zustand"

export type Notification = {
  id: string
  type: "like" | "comment"
  is_read: boolean
  created_at: string
  actor: {
    id: string
    name: string
    avatar_url?: string
  }
  post?: {
    id: string
    content: string
  }
}

type NotificationStore = {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (data: Notification[]) => void
  markAsRead: (id: string) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (data) => {
    set({
      notifications: data,
      unreadCount: data.filter((n) => !n.is_read).length,
    })
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    )
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.is_read).length,
    })
  },
}))
```

### 8.4 — Frontend: Notification Item Component

Sidiq buat `apps/frontend/src/components/NotificationItem.tsx`:

```tsx
import { Heart, MessageCircle } from "lucide-react"

type NotificationItemProps = {
  type: "like" | "comment"
  actor: {
    name: string
    avatar_url?: string
  }
  post?: {
    content: string
  }
  isRead: boolean
}

export default function NotificationItem({
  type,
  actor,
  post,
  isRead,
}: NotificationItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border transition ${
        isRead
          ? "bg-white hover:bg-gray-50"
          : "bg-blue-50 border-blue-200 hover:bg-blue-100"
      }`}
    >
      {/* Avatar */}
      <img
        src={
          actor.avatar_url || `https://ui-avatars.com/api/?name=${actor.name}`
        }
        alt={actor.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{actor.name}</span>
          {type === "like" ? " ❤️ menyukai" : " 💬 mengomentari"} postingan kamu
        </p>
        {post && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            "{post.content}"
          </p>
        )}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0">
        {type === "like" ? (
          <Heart size={18} className="text-red-400 fill-red-400" />
        ) : (
          <MessageCircle size={18} className="text-blue-400" />
        )}
      </div>

      {/* Unread indicator */}
      {!isRead && (
        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  )
}
```

### 8.5 — Frontend: Notification Page

Sidiq buat `apps/frontend/src/pages/NotificationPage.tsx`:

```tsx
import { useEffect } from "react"
import { useAuthStore } from "../stores/auth.store"
import { useNotificationStore } from "../stores/notification.store"
import { Navbar } from "../components"
import NotificationItem from "../components/NotificationItem"
import { Bell, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL

export default function NotificationPage() {
  const user = useAuthStore((s) => s.user)
  const { notifications, setNotifications, unreadCount } =
    useNotificationStore()

  const fetchNotifications = async () => {
    if (!user?.id) return
    try {
      const res = await fetch(`${API_URL}/notifications/${user.id}`)
      if (!res.ok) throw new Error("Gagal fetch notifikasi")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Gagal memuat notifikasi")
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [user?.id])

  const handleRefresh = () => {
    toast.loading("Sedang refresh...")
    fetchNotifications()
    toast.success("Notifikasi di-update")
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">
              Notifikasi
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            className="text-blue-500 hover:text-blue-700 transition p-2"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-400 text-lg">Tidak ada notifikasi</p>
            <p className="text-sm text-gray-300 mt-1">
              Notifikasi akan muncul ketika ada yang like/comment postingan kamu
            </p>
          </div>
        )}

        {/* Notifications list */}
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              type={notif.type}
              actor={notif.actor}
              post={notif.post || undefined}
              isRead={notif.is_read}
            />
          ))}
        </div>
      </div>
    </>
  )
}
```

### 8.6 — Update App.tsx (Sidiq)

Sidiq update `apps/frontend/src/App.tsx` untuk include NotificationPage:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import PostDetailPage from "./pages/PostDetailPage"
import NotificationPage from "./pages/NotificationPage"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

### 8.7 — Setup Welcome Notification (Bonus)

Update `apps/frontend/src/pages/LoginPage.tsx` untuk trigger welcome notification:

```tsx
// Sebelum:
toast.success(`Selamat Datang, ${data.user.name}! 👋`)

// Sesudah:
toast.success(`Selamat Datang, ${data.user.name}! 👋`, {
  duration: 4000,
  description: "Selamat bergabung dengan komunitas kami!",
})
```

### 8.8 — Test Notifikasi

```bash
# 1. Login
# 2. Klik notification icon di navbar (atau langsung ke /notifications)
# 3. Seharusnya lihat list notifikasi dari dummy data
# 4. Ada badge merah menunjukkan jumlah notif yang belum dibaca
# 5. Klik refresh → update notifikasi list
```

### 8.9 — Commit & Push

```bash
git add .
git commit -m "feat(notifikasi): endpoint GET /notifications, halaman NotificationPage, store, ShadCN Sonner"
git push origin feat/notifikasi
```

---

## 9. Environment Variables

### Backend (`apps/backend/.env`)

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/instagram_clone"
JWT_SECRET="secret-dev-minggu-15-ppwl-super-rahasia"
SECRET_KEY="rahasia-dosen-123"
PORT=3000
```

### Frontend (`apps/frontend/.env.local`)

```env
VITE_API_URL="http://localhost:3000"
```

> ⚠️ **JANGAN PERNAH** commit `.env` atau `.env.local` ke GitHub. Gunakan `.env.example`:

```env
# .env.example (di repo, tanpa nilai sebenarnya)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-here"
SECRET_KEY="your-key-here"
PORT=3000
```

---

## 10. Testing Lokal Sebelum Deploy

### Quick Start All-in-One

```bash
cd instagram-clone

# Terminal 1: Backend
cd apps/backend
bun run dev
# Output: 🦊 Backend berjalan di http://localhost:3000

# Terminal 2: Frontend (di terminal baru)
cd apps/frontend
bun run dev
# Output: http://localhost:5173
```

### Testing Checklist

**Auth Flow:**
- [ ] Register user baru → dapat JWT token ✅
- [ ] Login dengan user tersebut ✅
- [ ] Toast "Selamat Datang" muncul ✅
- [ ] Redirect ke beranda ✅
- [ ] Refresh page → tetap login (localStorage bekerja) ✅
- [ ] Logout → redirect ke login ✅

**Beranda:**
- [ ] Lihat 3 postingan dari dummy data ✅
- [ ] Tampil avatar + nama + username user ✅
- [ ] Tampil gambar post (jika ada) ✅
- [ ] Tampil jumlah likes & comments ✅
- [ ] Navbar ada (logo, home, notification, user menu, logout) ✅

**Detail Post:**
- [ ] Klik post → masuk ke halaman detail ✅
- [ ] Tampil post content lengkap ✅
- [ ] Tampil section "Komentar" dengan 2-3 komentar dari dummy data ✅
- [ ] Tombol "Kembali" bekerja ✅

**Notifikasi:**
- [ ] Klik notification icon → masuk ke halaman notifikasi ✅
- [ ] Lihat 3-5 notifikasi dari dummy data ✅
- [ ] Tampil informasi: "[User] menyukai/mengomentari postingan kamu" ✅
- [ ] Badge merah menunjukkan unread count ✅

**General:**
- [ ] Tidak ada error di console (F12) ✅
- [ ] Network tab: semua request 200 OK ✅
- [ ] Styling responsive mobile & desktop ✅

---

## 11. Panduan Deploy AWS

> Kania + Tim koordinasi untuk deploy ke AWS.

### Frontend to S3 + CloudFront

```bash
cd apps/frontend
bun run build

# Upload ke S3
aws s3 sync dist/ s3://nama-bucket-instagram-clone/ --delete

# Configure Static Website Hosting di S3 console
# CloudFront Distribution pointing to S3
```

### Backend to EC2 + RDS

```bash
# EC2 Instance
sudo apt update && sudo apt install -y curl postgresql-client
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

git clone https://github.com/kaniaa-kr/uas-ppwl.git
cd uas-ppwl/apps/backend
bun install

# Setup .env dengan RDS endpoint
nano .env
# DATABASE_URL="postgresql://user:pass@rds-endpoint:5432/db"

bunx prisma migrate deploy
bun run db:seed
pm2 start "bun run src/index.ts" --name backend
```

### Database: AWS RDS PostgreSQL

```
RDS Console → Create Database
- Engine: PostgreSQL 16
- Template: Free tier
- DB instance: instagram-clone
- Master username: postgres
- Master password: [strong-password]
- VPC: tautkan ke EC2
- Enable public accessibility
- Create
```

---

## 12. Checklist Pengumpulan Minggu 15

Sebelum submit, pastikan:

### Backend ✅

- [ ] `POST /auth/register` — user baru bisa mendaftar
- [ ] `POST /auth/login` — user bisa login, dapat JWT
- [ ] `GET /users?key=SECRET_KEY` — dosen bisa lihat user list
- [ ] `GET /posts` — list 3 postingan tampil
- [ ] `GET /comments/post/:id` — komentar tampil
- [ ] `GET /notifications/:userId` — notifikasi tampil
- [ ] Database punya dummy data minimal: 3 users, 3 posts, 3 comments, 3 notifikasi
- [ ] Semua endpoint bisa ditest dengan Postman/Thunder Client

### Frontend ✅

- [ ] Login page + Register page bisa diakses
- [ ] Zustand auth store bekerja + persist
- [ ] ProtectedRoute prevent access tanpa login
- [ ] Beranda menampilkan postingan dari API
- [ ] Detail post menampilkan komentar dari API
- [ ] Notifikasi page menampilkan notif list dari API
- [ ] Navbar ada (home, notification, user menu, logout)
- [ ] ShadCN Sonner popup "Selamat Datang" saat login
- [ ] Styling responsif mobile & desktop
- [ ] Tidak ada error di console

### Infrastructure ✅

- [ ] Frontend ter-deploy (S3/Vercel)
- [ ] Backend ter-deploy (EC2/Lambda)
- [ ] Database production di RDS
- [ ] Domain/endpoint bisa diakses dari browser

### Repo ✅

- [ ] Semua fitur punya PR yang di-merge ke main
- [ ] README lengkap dengan instruksi setup
- [ ] ERD diagram ada di `docs/ERD.md`
- [ ] Tidak ada credentials hardcoded
- [ ] `.env` ada di `.gitignore`

---

## 13. Troubleshooting

### Backend Errors

**Error: `DATABASE_URL` tidak ditemukan**
```bash
cd apps/backend
echo 'DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/instagram_clone"' > .env
bunx prisma migrate dev --name init
```

**Error: `BigInt cannot be serialized`**
```typescript
// Ubah ke string:
return posts.map((p) => ({
  ...p,
  id: p.id.toString(),
  user_id: p.user_id.toString(),
}))
```

**Error: CORS error di frontend**
```typescript
// Backend sudah pakai cors?
app.use(cors({ origin: "*" }))
```

### Frontend Errors

**Error: `Cannot find module`**
```bash
cd apps/frontend
bun install
```

**Error: `VITE_API_URL` undefined**
```bash
# Buat .env.local
echo 'VITE_API_URL="http://localhost:3000"' > apps/frontend/.env.local
```

**Error: State undefined saat refresh**
```typescript
// Zustand punya persist?
persist((set) => ({...}), { name: "auth-storage" })
```

### Git Conflicts

```bash
# Cek file yang conflict
git status

# Edit file, hapus <<<, ===, >>>
# Lalu:
git add file-yang-conflict
git commit -m "fix: resolve conflict"
git push origin feat/branch-kamu
```

---

## 📝 Final Notes

- **Komunikasi:** Gunakan chat grup untuk koordinasi
- **Commit messages:** Jelas dan deskriptif
- **Testing:** Test lokal dulu sebelum push
- **PR Review:** Minta review dari 1 anggota sebelum merge
- **Help:** Buat issue di repo jika ada kendala

**Sukses untuk Minggu 15! 🚀**
