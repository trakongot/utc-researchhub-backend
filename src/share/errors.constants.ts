export const ErrRequired = (field: string) => `${field} không được để trống.`;
export const ErrInvalidUUID = (field: string) =>
  `${field} phải là một UUID hợp lệ.`;
export const ErrMinLength = (field: string, length: number) =>
  `${field} phải có ít nhất ${length} ký tự.`;
export const ErrInvalidDate = (field: string) =>
  `${field} phải là một ngày hợp lệ.`;
export const ErrMaxLength = (field: string, length: number) =>
  `${field} tối đa ${length} ký tự.`;
