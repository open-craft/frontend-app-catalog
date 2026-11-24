import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';

import type { CatalogSearchResponse } from '@src/data/catalog-search/types';
import { CatalogDataTableCardViewSlot, CatalogDataTableSlot } from '..';

const mockSlotProps: Record<string, any> = {};

jest.mock('@openedx/frontend-base', () => {
  const actual = jest.requireActual('@openedx/frontend-base');
  return {
    ...actual,
    // Capture the props each slot receives. Stop at the deprecated slots so
    // the table and card view below them do not need a real DataTable context.
    Slot: ({ id, children, ...props }: { id: string, children?: React.ReactNode }) => {
      mockSlotProps[id] = props;
      if (id.endsWith('courseCatalogDataTable.v1') || id.endsWith('courseCatalogDataTableCardView.v1')) {
        return null;
      }
      return <>{children}</>;
    },
  };
});

const NEW_TABLE = 'org.openedx.frontend.slot.catalog.catalogDataTable.v1';
const OLD_TABLE = 'org.openedx.frontend.slot.catalog.courseCatalogDataTable.v1';
const NEW_CARD_VIEW = 'org.openedx.frontend.slot.catalog.catalogDataTableCardView.v1';
const OLD_CARD_VIEW = 'org.openedx.frontend.slot.catalog.courseCatalogDataTableCardView.v1';

const course = {
  id: 'course-v1:dev+1+2026',
  index: 'course_info',
  type: 'course' as const,
  data: {
    id: 'course-v1:dev+1+2026',
    course: 'course-v1:dev+1+2026',
    start: '2026-01-01T00:00:00Z',
    imageUrl: '/course.jpg',
    org: 'dev',
    content: { displayName: 'Course one', number: '1' },
    number: '1',
    modes: ['audit'],
    language: 'en',
    catalogVisibility: 'both',
  },
};

const pathway = {
  id: 'pathway-1',
  type: 'pathway' as const,
  data: {
    org: 'dev',
    itemCount: 2,
    content: { displayName: 'Pathway one' },
    category: 'bootcamp',
    categoryLabel: 'Bootcamp',
    categoryBackgroundColor: '#000000',
    categoryTextColor: '#ffffff',
  },
};

const response: CatalogSearchResponse = {
  took: 2,
  total: 2,
  maxScore: 1,
  aggs: {},
  results: [course, pathway],
};

const renderSlot = (ui: React.ReactElement) => render(
  <IntlProvider locale="en">{ui}</IntlProvider>,
);

describe('catalog data table slot contracts', () => {
  beforeEach(() => {
    Object.keys(mockSlotProps).forEach((key) => delete mockSlotProps[key]);
  });

  it('gives the new data table slot the mixed response and the old one courses only', () => {
    renderSlot(
      <CatalogDataTableSlot
        displayData={response}
        totalItems={2}
        pageCount={1}
        pageIndex={0}
        tableColumns={[]}
        handleFetchData={jest.fn()}
      />,
    );

    expect(mockSlotProps[NEW_TABLE].displayData).toBe(response);
    expect(mockSlotProps[NEW_TABLE].totalItems).toBe(2);
    expect(mockSlotProps[OLD_TABLE].displayData).toEqual({ ...response, results: [course] });
    expect(mockSlotProps[OLD_TABLE].totalCourses).toBe(2);
  });

  it('gives the new card view the mixed response and the old one courses only', () => {
    renderSlot(<CatalogDataTableCardViewSlot displayData={response} />);

    expect(mockSlotProps[NEW_CARD_VIEW].displayData).toBe(response);
    expect(mockSlotProps[OLD_CARD_VIEW].displayData).toEqual({ ...response, results: [course] });
  });

  it('does not fail while the response is still loading', () => {
    renderSlot(<CatalogDataTableCardViewSlot />);

    expect(mockSlotProps[NEW_CARD_VIEW].displayData).toBeUndefined();
    expect(mockSlotProps[OLD_CARD_VIEW].displayData).toBeUndefined();
  });
});
