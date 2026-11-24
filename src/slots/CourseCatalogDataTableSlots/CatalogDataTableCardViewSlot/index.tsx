import { CardView } from '@openedx/paragon';
import { Slot } from '@openedx/frontend-base';

import { DEFAULT_PAGE_SIZE } from '@src/data/catalog-search/constants';
import type { CatalogSearchResponse, CourseListSearchResponse } from '@src/data/catalog-search/types';
import { toCourseResponse } from '@src/data/catalog-search/utils';
import CatalogDataTableCourseCardSlot from './CatalogDataTableCourseCardSlot';

export interface CatalogDataTableCardViewSlotProps {
  displayData?: CatalogSearchResponse;
}

/** @deprecated Use `CatalogDataTableCardViewSlotProps` and `org.openedx.frontend.slot.catalog.catalogDataTableCardView.v1`. */
export interface CourseCatalogDataTableCardViewSlotProps {
  displayData?: CourseListSearchResponse;
}

const CatalogDataTableCardViewSlot = ({ displayData }: CatalogDataTableCardViewSlotProps) => (
  <Slot
    id="org.openedx.frontend.slot.catalog.catalogDataTableCardView.v1"
    displayData={displayData}
  >
    <Slot
      id="org.openedx.frontend.slot.catalog.courseCatalogDataTableCardView.v1"
      displayData={toCourseResponse(displayData)}
    >
      <CardView
        CardComponent={CatalogDataTableCourseCardSlot}
        skeletonCardCount={Math.min(displayData?.total ?? DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE)}
      />
    </Slot>
  </Slot>
);

export default CatalogDataTableCardViewSlot;
