import { Slot } from '@openedx/frontend-base';

import { PathwayCard } from '@src/generic';
import type { Pathway } from '@src/generic/pathway-card/types';

export interface CourseCatalogDataTablePathwayCardSlotProps {
  isLoading?: boolean;
  pathwayId?: string;
  name?: string;
  org?: string;
  courseCount?: number;
  imageUrl?: string;
  startDate?: string;
  advertisedStart?: string;
  type?: string;
  typeBackgroundColor?: string;
  typeTextColor?: string;
}

const CourseCatalogDataTablePathwayCardSlot = ({
  original: pathwayData,
  isLoading,
}: {
  original?: Pathway;
  isLoading?: boolean;
}) => {
  const slotProps: CourseCatalogDataTablePathwayCardSlotProps = {
    isLoading,
    pathwayId: pathwayData?.id,
    name: pathwayData?.data.content.displayName,
    org: pathwayData?.data.org,
    courseCount: pathwayData?.data.courseCount,
    imageUrl: pathwayData?.data.imageUrl,
    startDate: pathwayData?.data.start,
    advertisedStart: pathwayData?.data.advertisedStart,
    type: pathwayData?.data.type,
    typeBackgroundColor: pathwayData?.data.typeBackgroundColor,
    typeTextColor: pathwayData?.data.typeTextColor,
  };

  return (
    <Slot
      id="org.openedx.frontend.slot.catalog.courseCatalogDataTablePathwayCard.v1"
      {...slotProps}
    >
      <PathwayCard {...slotProps} />
    </Slot>
  );
};

export default CourseCatalogDataTablePathwayCardSlot;
