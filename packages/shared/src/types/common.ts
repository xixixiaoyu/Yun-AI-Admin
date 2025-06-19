/**
 * 通用类型定义
 */

// API 响应基础结构
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
  timestamp?: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 排序参数
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// 查询参数基础接口
export interface BaseQueryParams extends PaginationParams {
  keyword?: string;
  sort?: SortParams;
  startDate?: Date;
  endDate?: Date;
}

// 树形结构节点
export interface TreeNode<T = any> {
  id: string;
  parentId?: string;
  children?: TreeNode<T>[];
  data?: T;
}

// 选项接口（用于下拉选择等）
export interface Option<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  children?: Option<T>[];
}

// 文件上传信息
export interface FileInfo {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// 文件上传响应
export interface UploadResponse {
  file: FileInfo;
  url: string;
}

// 批量操作参数
export interface BatchOperationDto {
  ids: string[];
  action: string;
  params?: Record<string, any>;
}

// 批量操作响应
export interface BatchOperationResponse {
  success: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// 统计数据
export interface StatisticsData {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
}

// 图表数据点
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

// 图表数据系列
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// 操作日志
export interface OperationLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

// 系统配置
export interface SystemConfig {
  key: string;
  value: any;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category?: string;
  updatedAt: Date;
  updatedBy: string;
}

// 错误信息
export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp?: number;
  path?: string;
}

// 验证错误
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// 表单验证结果
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// 导出参数
export interface ExportParams {
  format: 'xlsx' | 'csv' | 'pdf';
  fields?: string[];
  filters?: Record<string, any>;
  filename?: string;
}

// 导入结果
export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors?: Array<{
    row: number;
    error: string;
  }>;
}
