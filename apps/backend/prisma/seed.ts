import { Pool } from "pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

// ============================================================
// STRATEGI: Pure raw SQL via pool.query()
// Alasan: Prisma 7.8.0 + Bun crash di isObjectEnumValue saat
// serialize BigInt ID. Bypass PrismaClient sepenuhnya.
// Fix NULL: pakai NULL::text / NULL::bigint eksplisit agar
// PostgreSQL tidak gagal infer tipe parameter.
// ============================================================

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL tidak ditemukan!")

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined,
  },
})

async function main() {
  console.log("🌱 Memulai seeding...")

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  console.log("🧹 Membersihkan data lama...")
  await pool.query(
    'TRUNCATE "Notification", "Comment", "PostLike", "Post", "User" RESTART IDENTITY CASCADE'
  )
  console.log("✅ Cleanup selesai")

  // ── Users ───────────────────────────────────────────────────────────────────
  console.log("👤 Membuat users...")

  const hashedPassword = await bcrypt.hash("password123", 10)
  const now = new Date().toISOString()

  // NULL::text agar PG tahu tipe kolom optional (password?, provider_id?, email_verified_at?)
  const usersResult = await pool.query(`
    INSERT INTO "User" (name, username, email, password, bio, avatar_url, provider, created_at, updated_at)
    VALUES
      ($1, 'alice', 'alice@example.com', $4, $5, $6, 'email', $7::timestamptz, $7::timestamptz),
      ($2, 'bob',   'bob@example.com',   $4, $8, $9, 'email', $7::timestamptz, $7::timestamptz),
      ($3, 'carol', 'carol@example.com', $4, $10, $11, 'email', $7::timestamptz, $7::timestamptz)
    RETURNING id, username
  `, [
    'Alice Johnson',                              // $1
    'Bob Smith',                                  // $2
    'Carol White',                                // $3
    hashedPassword,                               // $4
    'Fotografer & traveler 📸✈️',                 // $5
    'https://i.pravatar.cc/150?u=alice',          // $6
    now,                                          // $7
    'Coffee addict ☕ | Dev by day',              // $8
    'https://i.pravatar.cc/150?u=bob',            // $9
    'Food & lifestyle 🍜🌿',                      // $10
    'https://i.pravatar.cc/150?u=carol',          // $11
  ])

  const [alice, bob, carol] = usersResult.rows
  console.log(`✅ Users: alice(${alice.id}), bob(${bob.id}), carol(${carol.id})`)

  // ── Posts ───────────────────────────────────────────────────────────────────
  console.log("🖼️  Membuat posts...")

  const postsResult = await pool.query(`
    INSERT INTO "Post" (user_id, content, image_url, created_at, updated_at)
    VALUES
      ($1, $4, $5, $3::timestamptz, $3::timestamptz),
      ($1, $6, $7, $3::timestamptz, $3::timestamptz),
      ($2, $8, $9, $3::timestamptz, $3::timestamptz),
      ($10, $11, $12, $3::timestamptz, $3::timestamptz),
      ($10, $13, $14, $3::timestamptz, $3::timestamptz)
    RETURNING id, user_id
  `, [
    alice.id,                                                       // $1
    bob.id,                                                         // $2
    now,                                                            // $3
    'Golden hour di Bali 🌅 #travel #sunset #bali',               // $4
    'https://picsum.photos/seed/post1/800/800',                    // $5
    'Morning vibes ☀️ #morning #coffee',                           // $6
    'https://picsum.photos/seed/post2/800/800',                    // $7
    'Late night coding session 💻 #dev #code',                     // $8
    'https://picsum.photos/seed/post3/800/800',                    // $9
    carol.id,                                                       // $10
    'Homemade ramen 🍜 #food #cooking #homemade',                 // $11
    'https://picsum.photos/seed/post4/800/800',                    // $12
    'Weekend market haul 🥦🍅 #healthy #lifestyle',               // $13
    'https://picsum.photos/seed/post5/800/800',                    // $14
  ])

  const [post1, post2, post3, post4, post5] = postsResult.rows
  console.log(`✅ Posts: ${postsResult.rows.length} posts`)

  // ── Likes ───────────────────────────────────────────────────────────────────
  console.log("❤️  Membuat likes...")

  await pool.query(`
    INSERT INTO "PostLike" (user_id, post_id, created_at)
    VALUES
      ($1, $4, $8::timestamptz),
      ($2, $4, $8::timestamptz),
      ($3, $5, $8::timestamptz),
      ($1, $5, $8::timestamptz),
      ($3, $6, $8::timestamptz),
      ($1, $7, $8::timestamptz),
      ($2, $7, $8::timestamptz)
  `, [
    bob.id,    // $1
    carol.id,  // $2
    alice.id,  // $3
    post1.id,  // $4
    post2.id,  // $5
    post3.id,  // $6
    post4.id,  // $7
    now,       // $8
  ])

  console.log("✅ Likes: 7 likes")

  // ── Comments ────────────────────────────────────────────────────────────────
  console.log("💬 Membuat comments...")

  // Top-level dulu (parent_id = NULL::bigint)
  const topResult = await pool.query(`
    INSERT INTO "Comment" (user_id, post_id, parent_id, content, created_at, updated_at)
    VALUES
      ($1, $4, NULL::bigint, 'Keren banget! Kapan balik Bali lagi? 😍',              $7::timestamptz, $7::timestamptz),
      ($2, $4, NULL::bigint, 'Foto yang sangat indah! 🔥',                            $7::timestamptz, $7::timestamptz),
      ($3, $5, NULL::bigint, 'Relatable banget, masih nunggu kopi ke-3 nih 😂',       $7::timestamptz, $7::timestamptz),
      ($3, $6, NULL::bigint, 'Wah recipe-nya dong! Kuahnya kelihatan pekat banget 🤤',$7::timestamptz, $7::timestamptz),
      ($1, $6, NULL::bigint, 'Ini homemade?! Keren parah 👏',                         $7::timestamptz, $7::timestamptz)
    RETURNING id, post_id, user_id
  `, [
    bob.id,    // $1
    carol.id,  // $2
    alice.id,  // $3
    post1.id,  // $4
    post3.id,  // $5
    post4.id,  // $6
    now,       // $7
  ])

  const [c1, c2, c3, c4, c5] = topResult.rows

  // Replies — parent_id pakai $N yang berisi ID konkret
  const replyResult = await pool.query(`
    INSERT INTO "Comment" (user_id, post_id, parent_id, content, created_at, updated_at)
    VALUES
      ($1, $3, $5, 'Makasih Bob! Mungkin bulan depan 😄',           $7::timestamptz, $7::timestamptz),
      ($2, $4, $6, 'Boleh, nanti aku share di post berikutnya! 🙏', $7::timestamptz, $7::timestamptz)
    RETURNING id, post_id, user_id, parent_id
  `, [
    alice.id,  // $1
    carol.id,  // $2
    post1.id,  // $3
    post4.id,  // $4
    c1.id,     // $5  ← reply ke c1 (bob's comment on post1)
    c4.id,     // $6  ← reply ke c4 (alice's comment on post4)
    now,       // $7
  ])

  const [r1, r2] = replyResult.rows
  console.log("✅ Comments: 7 (5 top-level + 2 replies)")

  // ── Notifications ───────────────────────────────────────────────────────────
  console.log("🔔 Membuat notifications...")

  // Pecah jadi 2 batch agar jumlah parameter tidak membingungkan PG
  // Batch 1: notif untuk alice (user_id = alice.id)
  await pool.query(`
    INSERT INTO "Notification" (user_id, actor_id, type, post_id, comment_id, is_read, created_at)
    VALUES
      ($1, $2, 'like',    $4, NULL::bigint, false, $3::timestamptz),
      ($1, $5, 'like',    $4, NULL::bigint, false, $3::timestamptz),
      ($1, $2, 'comment', $4, $6,           false, $3::timestamptz),
      ($1, $5, 'comment', $4, $7,           false, $3::timestamptz),
      ($1, $5, 'comment', $8, $9,           false, $3::timestamptz)
  `, [
    alice.id,  // $1  receiver
    bob.id,    // $2  actor
    now,       // $3
    post1.id,  // $4
    carol.id,  // $5  actor
    c1.id,     // $6  bob's comment
    c2.id,     // $7  carol's comment
    post4.id,  // $8
    r2.id,     // $9  carol reply ke alice's comment on post4
  ])

  // Batch 2: notif untuk bob
  await pool.query(`
    INSERT INTO "Notification" (user_id, actor_id, type, post_id, comment_id, is_read, created_at)
    VALUES
      ($1, $2, 'like',    $4, NULL::bigint, false, $3::timestamptz),
      ($1, $5, 'like',    $4, NULL::bigint, false, $3::timestamptz),
      ($1, $2, 'comment', $4, $6,           false, $3::timestamptz),
      ($1, $2, 'comment', $7, $8,           false, $3::timestamptz)
  `, [
    bob.id,    // $1  receiver
    alice.id,  // $2  actor
    now,       // $3
    post3.id,  // $4
    carol.id,  // $5  actor
    c3.id,     // $6  alice's comment on post3
    post1.id,  // $7
    r1.id,     // $8  alice reply ke bob's comment on post1
  ])

  // Batch 3: notif untuk carol
  await pool.query(`
    INSERT INTO "Notification" (user_id, actor_id, type, post_id, comment_id, is_read, created_at)
    VALUES
      ($1, $2, 'like',    $4, NULL::bigint, false, $3::timestamptz),
      ($1, $5, 'like',    $4, NULL::bigint, false, $3::timestamptz),
      ($1, $2, 'comment', $4, $6,           false, $3::timestamptz),
      ($1, $5, 'comment', $4, $7,           false, $3::timestamptz)
  `, [
    carol.id,  // $1  receiver
    alice.id,  // $2  actor
    now,       // $3
    post4.id,  // $4
    bob.id,    // $5  actor
    c4.id,     // $6  alice's comment on post4
    c5.id,     // $7  bob's comment on post4
  ])

  console.log("✅ Notifications: 13 notifikasi (3 batch)")

  // ── Verifikasi ──────────────────────────────────────────────────────────────
  const { rows: [c] } = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM "User")         AS users,
      (SELECT COUNT(*) FROM "Post")         AS posts,
      (SELECT COUNT(*) FROM "PostLike")     AS likes,
      (SELECT COUNT(*) FROM "Comment")      AS comments,
      (SELECT COUNT(*) FROM "Notification") AS notifications
  `)

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Seeding selesai! (verified dari DB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Users         : ${c.users}
🖼️  Posts         : ${c.posts}
❤️  Likes         : ${c.likes}
💬 Comments      : ${c.comments}
🔔 Notifications : ${c.notifications}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Credentials: password → password123
  `)
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e.message ?? e)
    process.exit(1)
  })
  .finally(() => pool.end())