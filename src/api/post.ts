import { z } from 'zod'
import { request } from './'

const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  reactions: z.object({
    likes: z.number(),
    dislikes: z.number(),
  }),
  views: z.number(),
  userId: z.number(),
})

const postListSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type Post = z.infer<typeof postSchema>
export type PostList = z.infer<typeof postListSchema>

export async function getPostList(params: {
  page: number
  pageSize: number
}): Promise<PostList> {
  const skip = (params.page - 1) * params.pageSize
  const limit = params.pageSize

  const { data } = await request.get<PostList>(
    `/posts?limit=${limit}&skip=${skip}`,
    { responseSchema: postListSchema },
  )

  return data
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await request.get<Post>(`/posts/${id}`, {
    responseSchema: postSchema,
  })
  return data
}
