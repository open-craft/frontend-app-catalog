import { Link } from 'react-router-dom';
import {
  Badge, Card, breakpoints, useMediaQuery,
} from '@openedx/paragon';
import { getAppConfig, resolveRouteByRole, useIntl } from '@openedx/frontend-base';

import noCourseImg from '@src/assets/images/no-course-image.svg';
import { appId, pathwayDetailRole } from '@src/constants';
import { isValidCssColor } from '@src/utils';

import messages from './messages';
import type { PathwayCardProps } from './types';
import { getFullImageUrl, getStartDateDisplay } from '../course-card/utils';

export const PathwayCard = ({
  isLoading,
  pathwayId,
  name,
  org,
  courseCount,
  imageUrl,
  startDate,
  advertisedStart,
  categoryLabel,
  categoryBackgroundColor,
  categoryTextColor,
}: PathwayCardProps) => {
  const intl = useIntl();
  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  const startDateDisplay = (startDate || advertisedStart)
    ? getStartDateDisplay({
        start: startDate,
        advertisedStart,
      }, intl)
    : null;

  const badgeLabel = categoryLabel || '';
  const badgeBackgroundColor = categoryBackgroundColor;
  const badgeTextColor = categoryTextColor;
  const pathwayDetailUrl = pathwayId
    ? resolveRouteByRole(pathwayDetailRole, { pathwayId })?.url
    : undefined;

  const hasCustomColors = !!badgeBackgroundColor
    && !!badgeTextColor
    && isValidCssColor(badgeBackgroundColor)
    && isValidCssColor(badgeTextColor);

  return (
    <Card
      as={pathwayDetailUrl ? Link : 'div'}
      to={pathwayDetailUrl}
      // TODO: Temporary use of `d-flex` to fix alignment. Remove once the related Paragon issue
      // (https://github.com/openedx/paragon/issues/3792) is resolved.
      className={`pathway-card d-flex ${isExtraSmall ? 'w-100' : 'pathway-card-desktop'}`}
      isClickable={!isLoading}
      isLoading={isLoading}
      data-testid="pathway-card"
    >
      <Card.ImageCap
        src={getFullImageUrl(imageUrl)}
        fallbackSrc={noCourseImg}
        srcAlt={name}
        skeletonDuringImageLoad
      />
      {!isLoading && getAppConfig(appId).ENABLE_PATHWAY_PILOT_UI === true && badgeLabel.trim() && (
        <Badge
          className="catalog-card-badge pathway-card-badge position-absolute py-1 px-2"
          style={hasCustomColors ? {
            backgroundColor: badgeBackgroundColor,
            color: badgeTextColor,
          } : undefined}
        >
          {badgeLabel}
        </Badge>
      )}
      <Card.Header
        title={name}
        subtitle={(
          <>
            <div>
              {courseCount !== undefined && intl.formatMessage(messages.courseCount, {
                count: courseCount,
              })}
            </div>
            <Badge variant="light">{org}</Badge>
          </>
        )}
        size="sm"
      />
      <Card.Section />
      <Card.Footer
        textElement={startDateDisplay && intl.formatMessage(messages.startDate, {
          startDate: startDateDisplay,
        })}
      />
    </Card>
  );
};
