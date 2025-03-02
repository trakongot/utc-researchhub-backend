import { Paginated } from './data-model';

// Thành công với dữ liệu danh sách
export const successPaginatedResponse = <T>(
  paginated: Paginated<T>,
  lastId: string | null,
) => ({
  data: paginated.data,
  message: 'Thành công',
  statusCode: 200,
  total: paginated.total,
  lastId,
});

// Thành công với dữ liệu đơn lẻ
export const successResponse = <T>(
  data: T | null,
  message: string = 'Thành công',
) => ({
  data,
  message,
  statusCode: 200,
});

// Thành công khi tạo tài nguyên
export const createdResponse = <T>(
  data: T | null,
  message: string = 'Tạo thành công',
) => ({
  data,
  message,
  statusCode: 201,
});

// Thành công khi xóa tài nguyên
export const deletedResponse = (message: string = 'Xóa thành công') => ({
  data: null,
  message,
  statusCode: 204,
});

// Lỗi không tìm thấy tài nguyên
export const notFoundResponse = (
  message: string = 'Không tìm thấy dữ liệu',
) => ({
  data: null,
  message,
  statusCode: 404,
});

// Lỗi không thành công khi tạo tài nguyên
export const errCreatedResponse = <T>(
  message: string = 'Tạo không thành công',
) => ({
  message,
  statusCode: 404,
});

// Lỗi không có quyền truy cập
export const forbiddenResponse = (
  message: string = 'Bạn không có quyền thực hiện thao tác này',
) => ({
  data: null,
  message,
  statusCode: 403,
});

// Lỗi chung (400, 500,...)
export const errorResponse = (
  message: string = 'Đã xảy ra lỗi, vui lòng thử lại sau',
  statusCode: number = 500,
) => ({
  data: null,
  message,
  statusCode,
});
