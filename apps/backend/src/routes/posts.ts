import { Elysia } from 'elysia';

// Wajib ditulis 'export const postRoutes'
export const postRoutes = new Elysia({ prefix: '/posts' })
  .get('/', () => {
    return { message: "Get all posts" };
  })
  .post('/', () => {
    return { message: "Create a post" };
  });