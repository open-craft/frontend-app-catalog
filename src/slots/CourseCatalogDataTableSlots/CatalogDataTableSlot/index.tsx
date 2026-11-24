import { useMemo } from 'react';
import {
  breakpoints, DataTable, useMediaQuery, TextFilter,
} from '@openedx/paragon';
import { getAppConfig, Slot, useIntl } from '@openedx/frontend-base';

import { appId } from '@src/constants';
import { DEFAULT_PAGE_SIZE } from '@src/data/catalog-search/constants';
import messages from '@src/catalog/messages';
import type {
  CatalogSearchResponse, CourseListSearchResponse, DataTableParams,
} from '@src/data/catalog-search/types';
import { toCourseResponse } from '@src/data/catalog-search/utils';

import CatalogDataTableControlBarSlot from '../CatalogDataTableControlBarSlot';
import CatalogDataTableCardViewSlot from '../CatalogDataTableCardViewSlot';
import CatalogDataTableTableFooterSlot from '../CatalogDataTableTableFooterSlot';

export interface TableColumnFilterChoice {
  name: string;
  number: number;
  value: string;
}

export interface TableColumn {
  Header: string;
  accessor: string;
  Filter: React.ComponentType<any>;
  filter: string;
  filterChoices: TableColumnFilterChoice[];
}

export interface CatalogDataTableSlotProps {
  displayData?: CatalogSearchResponse;
  totalItems: number;
  pageCount: number;
  pageIndex: number;
  tableColumns: TableColumn[];
  handleFetchData: (params: DataTableParams) => void;
}

/** @deprecated Use `CatalogDataTableSlotProps` and `org.openedx.frontend.slot.catalog.catalogDataTable.v1`. */
export interface CourseCatalogDataTableSlotProps {
  displayData?: CourseListSearchResponse;
  totalCourses: number;
  pageCount: number;
  pageIndex: number;
  tableColumns: TableColumn[];
  handleFetchData: (params: DataTableParams) => void;
}

const CatalogDataTableSlot = ({
  displayData,
  totalItems,
  pageCount,
  pageIndex,
  tableColumns,
  handleFetchData,
}: CatalogDataTableSlotProps) => {
  const intl = useIntl();
  const isMedium = useMediaQuery({ maxWidth: breakpoints.large.maxWidth });
  const courseDisplayData = useMemo(() => toCourseResponse(displayData), [displayData]);

  return (
    <Slot
      id="org.openedx.frontend.slot.catalog.catalogDataTable.v1"
      displayData={displayData}
      totalItems={totalItems}
      pageCount={pageCount}
      pageIndex={pageIndex}
      tableColumns={tableColumns}
      handleFetchData={handleFetchData}
    >
      <Slot
        id="org.openedx.frontend.slot.catalog.courseCatalogDataTable.v1"
        displayData={courseDisplayData}
        totalCourses={totalItems}
        pageCount={pageCount}
        pageIndex={pageIndex}
        tableColumns={tableColumns}
        handleFetchData={handleFetchData}
      >
        <DataTable
          showFiltersInSidebar={!isMedium}
          numBreakoutFilters={0}
          isFilterable={getAppConfig(appId).ENABLE_COURSE_DISCOVERY === true}
          isSortable
          isPaginated
          manualFilters
          manualPagination
          defaultColumnValues={{ Filter: TextFilter }}
          itemCount={displayData?.total || totalItems}
          pageSize={DEFAULT_PAGE_SIZE}
          pageCount={pageCount}
          initialState={{ pageSize: DEFAULT_PAGE_SIZE, pageIndex }}
          data={displayData?.results}
          columns={tableColumns}
          fetchData={handleFetchData}
          initialTableOptions={{ getRowId: (row) => row.id }}
        >
          <CatalogDataTableControlBarSlot
            currentPageResultsCount={displayData?.results?.length ?? 0}
            totalResultsCount={displayData?.total ?? 0}
          />
          <CatalogDataTableCardViewSlot displayData={displayData} />
          <DataTable.EmptyTable content={intl.formatMessage(messages.noResultsFound)} />
          <CatalogDataTableTableFooterSlot />
        </DataTable>
      </Slot>
    </Slot>
  );
};

export default CatalogDataTableSlot;
