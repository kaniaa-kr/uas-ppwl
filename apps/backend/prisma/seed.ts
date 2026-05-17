import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

// Setup Driver Adapter PostgreSQL wajib untuk Prisma v7
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di file .env!")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Mulai seeding sesuai modul praktikum...")

  // Hapus data lama agar tidak bentrok saat seed dijalankan ulang
  await prisma.notification.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // Buat users dummy
  const hashedPassword = await bcrypt.hash("password123", 10)

  // User 1: Login via Form Biasa
  const user1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      username: "budi_s",
      email: "budi@test.com",
      password: hashedPassword,
      avatar_url: "https://i.pravatar.cc/150?img=1",
      bio: "Suka kopi dan ngoding",
      provider: "email",       // 💡 Sesuai rancangan kolom modul halaman 2
      provider_id: null,
    },
  })

  // User 2: Login via Form Biasa
  const user2 = await prisma.user.create({
    data: {
      name: "Siti Rahayu",
      username: "siti_r",
      email: "siti@test.com",
      password: hashedPassword,
      avatar_url: "https://i.pravatar.cc/150?img=2",
      bio: "Pecinta kucing 🐱",
      provider: "email",       // 💡 Sesuai rancangan kolom modul halaman 2
      provider_id: null,
    },
  })

  // User 3: Login via Google OAuth (Password NULL)
  const user3 = await prisma.user.create({
    data: {
      name: "Ahmad Fauzi",
      username: "ahmad_f",
      email: "ahmad@test.com",
      password: null,          // 💡 Modul: password NULL jika OAuth-only
      avatar_url: "https://i.pravatar.cc/150?img=3",
      provider: "google",      // 💡 Sesuai rancangan kolom modul halaman 2
      provider_id: "google_oauth_id_12345", // ID Dummy Google Auth
    },
  })

  console.log("✅ Users selesai dibuat")

  // Buat posts dummy
  const post1 = await prisma.post.create({
    data: {
      user_id: user1.id,
      content: "Hari pertama coding pakai ElysiaJS, ternyata cepet banget! ⚡",
      image_url: "https://picsum.photos/seed/post1/600/400",
    },
  })

  const post2 = await prisma.post.create({
    data: {
      user_id: user2.id,
      content: "Sunset sore ini di Bandung, cantik banget 🌅",
      image_url: "https://picsum.photos/seed/post2/600/400",
    },
  })

  const post3 = await prisma.post.create({
    data: {
      user_id: user3.id,
      content: "Tips belajar React: mulai dari yang kecil, build terus sampai terbiasa 💪",
    },
  })

  console.log("✅ Posts selesai dibuat")

  // Buat comments dummy
  const comment1 = await prisma.comment.create({
    data: {
      post_id: post1.id,
      user_id: user2.id,
      content: "Wah beneran? Harus coba nih!",
    },
  })

  const comment2 = await prisma.comment.create({
    data: {
      post_id: post1.id,
      user_id: user3.id,
      content: "ElysiaJS emang mantap, performanya top 🔥",
    },
  })

  await prisma.comment.create({
    data: {
      post_id: post2.id,
      user_id: user1.id,
      content: "Indah banget! Kapan ke sana lagi?",
    },
  })

  console.log("✅ Comments selesai dibuat")

  // Buat likes dummy
  await prisma.postLike.createMany({
    data: [
      { post_id: post1.id, user_id: user2.id },
      { post_id: post1.id, user_id: user3.id },
      { post_id: post2.id, user_id: user1.id },
      { post_id: post3.id, user_id: user1.id },
      { post_id: post3.id, user_id: user2.id },
    ],
  })

  console.log("✅ Likes selesai dibuat")

  // Buat notifications dummy
  await prisma.notification.createMany({
    data: [
      {
        user_id: user1.id,  // Pemilik post1 (Budi)
        actor_id: user2.id, // Yang memicu aksi (Siti)
        type: "comment",    // Sesuai enum modul: 'like', 'comment', 'follow'
        post_id: post1.id,
        comment_id: comment1.id,
        is_read: false,
      },
      {
        user_id: user1.id,  // Pemilik post1 (Budi)
        actor_id: user3.id, // Yang memicu aksi (Ahmad)
        type: "comment",
        post_id: post1.id,
        comment_id: comment2.id,
        is_read: false,
      },
      {
        user_id: user1.id,  // Pemilik post1 (Budi)
        actor_id: user2.id, // Yang memicu aksi (Siti)
        type: "like",
        post_id: post1.id,
        is_read: true,
      },
    ],
  })

  console.log("✅ Notifications selesai dibuat")
  console.log("🎉 Seeding selesai dengan sukses!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })