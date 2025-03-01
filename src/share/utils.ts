import { Paginated } from './data-model';

export const paginatedResponse = <E>(paginated: Paginated<E>, filter: any) => ({
  data: paginated.data,
  paging: paginated.paging,
  total: paginated.total,
  filter,
});

export interface ErrorResponse {
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}
