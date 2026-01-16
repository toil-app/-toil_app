/**
 * Base entity interface that all Firestore documents should extend
 */
export interface BaseEntity {
  id: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
}

/**
 * Pagination options for querying
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Sort options for querying
 */
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter condition for querying
 */
export interface FilterCondition {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'array-contains';
  value: any;
}

/**
 * Query options combining filters, sorting, and pagination
 */
export interface QueryOptions {
  filters?: FilterCondition[];
  sort?: SortOptions;
  pagination?: PaginationOptions;
}

/**
 * Generic response wrapper for API operations
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * Generic list response
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}
