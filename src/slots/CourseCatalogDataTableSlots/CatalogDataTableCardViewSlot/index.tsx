import { useMemo } from 'react';
import { CardView } from '@openedx/paragon';
import { Slot } from '@openedx/frontend-base';

import { DEFAULT_PAGE_SIZE } from '@src/data/catalog-search/constants';
import type {
  CatalogSearchResponse, CatalogSearchResult, CourseListSearchResponse,
} from '@src/data/catalog-search/types';
import { toCourseResponse } from '@src/data/catalog-search/utils';
import CatalogDataTableCourseCardSlot from './CatalogDataTableCourseCardSlot';
import CatalogDataTablePathwayCardSlot from './CatalogDataTablePathwayCardSlot';

export interface CatalogDataTableCardViewSlotProps {
  displayData?: CatalogSearchResponse;
}

/** @deprecated Use `CatalogDataTableCardViewSlotProps` and `org.openedx.frontend.slot.catalog.catalogDataTableCardView.v1`. */
export interface CourseCatalogDataTableCardViewSlotProps {
  displayData?: CourseListSearchResponse;
}

interface CatalogDataTableResultCardProps {
  original?: CatalogSearchResult;
  isLoading?: boolean;
}

/**
 * CardView renders a single CardComponent for every row, so this wrapper
 * dispatches each result to its course or pathway card slot (the same
 * pattern as CoursesList on the home page).
 */
const CatalogDataTableResultCard = ({
  original, isLoading,
}: CatalogDataTableResultCardProps) => {
  switch (original?.type) {
    case 'pathway':
      return <CatalogDataTablePathwayCardSlot original={original} isLoading={isLoading} />;
    default:
      return <CatalogDataTableCourseCardSlot original={original} isLoading={isLoading} />;
  }
};

const CatalogDataTableCardViewSlot = ({ displayData }: CatalogDataTableCardViewSlotProps) => {
  const courseDisplayData = useMemo(() => toCourseResponse(displayData), [displayData]);

  return (
    <Slot
      id="org.openedx.frontend.slot.catalog.catalogDataTableCardView.v1"
      displayData={displayData}
    >
      <Slot
        id="org.openedx.frontend.slot.catalog.courseCatalogDataTableCardView.v1"
        displayData={courseDisplayData}
      >
        <CardView
          CardComponent={CatalogDataTableResultCard}
          skeletonCardCount={Math.min(displayData?.total ?? DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE)}
        />
      </Slot>
    </Slot>
  );
};

export default CatalogDataTableCardViewSlot;
export { CatalogDataTableResultCard };
