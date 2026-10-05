import classNames from 'classnames';
import { Slot, useIntl } from '@openedx/frontend-base';
import { breakpoints, useMediaQuery } from '@openedx/paragon';

import { getPageTitle } from '@src/catalog/utils';
import { SubHeader } from '@src/generic';

export interface ExploreIntroSlotProps {
  searchString: string;
  resultsCount?: number;
}

/**
 * Props a consumer's replacement component receives.
 *
 * `courseDataResultsLength` predates `resultsCount` and is still passed so
 * plugins written against the old prop name keep working.
 */
export interface ExploreIntroSlotPluginProps {
  searchString: string;
  resultsCount?: number;
  /** @deprecated Use `resultsCount` instead. */
  courseDataResultsLength?: number;
}

const ExploreIntroSlot = ({
  searchString,
  resultsCount,
}: ExploreIntroSlotProps) => {
  const intl = useIntl();
  const isMedium = useMediaQuery({ maxWidth: breakpoints.medium.maxWidth });

  return (
    <Slot
      id="org.openedx.frontend.slot.catalog.exploreIntro.v1"
      searchString={searchString}
      resultsCount={resultsCount}
      courseDataResultsLength={resultsCount}
    >
      <SubHeader
        title={getPageTitle({
          intl,
          searchString,
          resultsCount,
        })}
        className={classNames({ 'mx-2.5': isMedium })}
      />
    </Slot>
  );
};

export default ExploreIntroSlot;
