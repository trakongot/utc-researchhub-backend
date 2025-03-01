import z from 'zod';

export const pagingDTOSchema = z.object({
  page: z.coerce
    .number()
    .min(1, { message: 'số trang ít nhất là 1' })
    .default(1),
  limit: z.coerce
    .number()
    .min(1, { message: 'giới hạn ít nhất là 1' })
    .max(100)
    .default(20),
  sort: z.string().optional(),
  order: z.string().optional(),
});

export interface PagingDTO extends z.infer<typeof pagingDTOSchema> {
  total?: number;
}

export type Paginated<E> = {
  data: E[];
  paging: PagingDTO;
  total: number;
};
