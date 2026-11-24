import type { CatalogSearchResponse, CourseListSearchResponse, DataTableFilter } from './types';

/**
 * Checks if a value is valid.
 */
const isValidValue = (
  value: string | undefined | null | '',
): boolean => value !== undefined && value !== null && value !== '';

/**
 * Appends filters to the FormData object for backend requests.
 */
export const addFiltersToFormData = (
  formData: FormData,
  filters: Record<string, string[]>,
): void => {
  if (!filters || typeof filters !== 'object') {
    return;
  }

  Object.entries(filters).forEach(([filterKey, filterValues]) => {
    if (Array.isArray(filterValues)) {
      filterValues
        .filter(isValidValue)
        .forEach(value => formData.append(filterKey, value));
    } else if (isValidValue(filterValues)) {
      formData.append(filterKey, filterValues);
    }
  });
};

/**
 * Transforms DataTable filters array into a Record<string, string[]> for API.
 */
export const transformDataTableFilters = (
  filters?: DataTableFilter[],
): Record<string, string[]> => {
  if (!filters) {
    return {};
  }

  const grouped: Record<string, Set<string>> = {};

  filters.forEach(({ id, value }) => {
    if (!grouped[id]) {
      grouped[id] = new Set();
    }

    const values = Array.isArray(value) ? value : [value];
    values.filter(isValidValue).forEach(v => grouped[id].add(v));
  });

  return Object.fromEntries(
    Object.entries(grouped).map(([id, set]) => [id, Array.from(set)]),
  );
};

/**
 * Narrows a mixed response to the course-only shape the pre-pathway slots
 * received. Pathway rows are dropped and the remaining rows are passed
 * through unchanged.
 */
export const toCourseResponse = (
  data?: CatalogSearchResponse,
): CourseListSearchResponse | undefined => {
  if (!data) {
    return undefined;
  }

  return {
    ...data,
    results: data.results.filter(
      (result) => result.type === 'course',
    ) as CourseListSearchResponse['results'],
  };
};
