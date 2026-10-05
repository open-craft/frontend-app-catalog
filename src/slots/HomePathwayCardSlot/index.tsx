import { getAppConfig, Slot } from '@openedx/frontend-base';

import { PathwayCard } from '@src/generic';
import { appId } from '@src/constants';
import type { Pathway } from '@src/generic/pathway-card/types';

export interface HomePathwayCardSlotProps {
  isLoading?: boolean;
  pathwayId?: string;
  name?: string;
  org?: string;
  courseCount?: number;
  imageUrl?: string;
  startDate?: string;
  advertisedStart?: string;
  category?: string;
  categoryLabel?: string;
  categoryBackgroundColor?: string;
  categoryTextColor?: string;
}

const HomePathwayCardSlot = ({
  original: pathwayData,
  isLoading,
}: {
  original?: Pathway;
  isLoading?: boolean;
}) => {
  if (getAppConfig(appId).ENABLE_PATHWAY_PILOT_UI !== true) {
    return null;
  }

  const slotProps: HomePathwayCardSlotProps = {
    isLoading,
    pathwayId: pathwayData?.id,
    name: pathwayData?.data.content.displayName,
    org: pathwayData?.data.org,
    courseCount: pathwayData?.data.courseCount,
    imageUrl: pathwayData?.data.imageUrl,
    startDate: pathwayData?.data.start,
    advertisedStart: pathwayData?.data.advertisedStart,
    category: pathwayData?.data.category,
    categoryLabel: pathwayData?.data.categoryLabel,
    categoryBackgroundColor: pathwayData?.data.categoryBackgroundColor,
    categoryTextColor: pathwayData?.data.categoryTextColor,
  };

  return (
    <Slot
      id="org.openedx.frontend.slot.catalog.homePathwayCard.v1"
      {...slotProps}
    >
      <PathwayCard {...slotProps} />
    </Slot>
  );
};

export default HomePathwayCardSlot;
