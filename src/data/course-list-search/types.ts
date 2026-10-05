import type { CourseData } from '@src/generic/course-card/types';

/** Shared envelope for search responses (everything except the result list). */
export interface SearchResponseBase {
  took: number;
  total: number;
  aggs: Record<string, {
    terms: Record<string, number>;
    /** Optional slug -> display label map (category facet enrichment). */
    labels?: Record<string, string>;
    total: number;
    other: number;
  }>;
  maxScore: number;
}

export interface CourseListSearchResponse extends SearchResponseBase {
  results: {
    id: string;
    index: string;
    type: string;
    title: string;
    data: CourseData;
  }[];
}

export type Aggregations = Record<string, {
  terms: Record<string, number>;
  labels?: Record<string, string>;
}>;

export interface CourseListSearchParams {
  pageSize?: number;
  pageIndex?: number;
  filters?: Record<string, string[]>;
  enableCourseSortingByStartDate?: boolean;
  searchString?: string;
}

export interface DataTableParams {
  pageSize?: number;
  pageIndex?: number;
  filters?: {
    id: string;
    value: string | string[];
  }[];
  searchString?: string;
}

export interface CourseListSearchHook {
  data: CourseListSearchResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  fetchData: (params: DataTableParams) => void;
}

export interface DataTableFilter {
  id: string;
  value: string | string[];
}
