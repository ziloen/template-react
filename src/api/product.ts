import { z } from 'zod'
import { request } from './'

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }),
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(
    z.object({
      rating: z.number(),
      comment: z.string(),
      date: z.string(),
      reviewerName: z.string(),
      reviewerEmail: z.string(),
    }),
  ),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  meta: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    barcode: z.string(),
    qrCode: z.string(),
  }),
  thumbnail: z.string(),
  images: z.array(z.string()),
})

const productListSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export type Product = z.infer<typeof productSchema>
export type ProductList = z.infer<typeof productListSchema>

export async function getProductList(params: {
  page: number
  pageSize: number
}): Promise<ProductList> {
  const skip = (params.page - 1) * params.pageSize
  const limit = params.pageSize

  const { data } = await request.get<ProductList>(
    `/products?limit=${limit}&skip=${skip}`,
    { responseSchema: productListSchema },
  )

  return data
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await request.get<Product>(`/products/${id}`, {
    responseSchema: productSchema,
  })
  return data
}
