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
- `OnDelete Cascade`: jika user/post dihapus, comments/likes/notifs ikut terhapus
- `OnDelete SetNull`: jika post/comment dihapus, notifikasi tetap ada tapi post_id/comment_id menjadi NULL

## Indexes

- `Post.user_id` — mempercepat query posts by user
- `Comment.post_id`, `Comment.user_id` — mempercepat query comments
- `PostLike.user_id` — mempercepat query likes by user
- `Notification.user_id`, `Notification.actor_id` — mempercepat query notifikasi
