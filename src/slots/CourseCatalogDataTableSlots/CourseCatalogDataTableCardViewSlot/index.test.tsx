import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getAppConfig, IntlProvider } from '@openedx/frontend-base';

import * as CourseCatalogDataTableSlots from '@src/slots/CourseCatalogDataTableSlots';

import CourseCatalogDataTablePathwayCardSlot from './CourseCatalogDataTablePathwayCardSlot';
import { CourseCatalogDataTableCardSlot } from '.';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAppConfig: jest.fn(),
}));

const mockGetAppConfig = getAppConfig as jest.Mock;

beforeEach(() => {
  mockGetAppConfig.mockReturnValue({ ENABLE_PATHWAY_PILOT_UI: true });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CourseCatalogDataTableCardSlot', () => {
  it('renders the course card slot for loading rows without a result', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <CourseCatalogDataTableCardSlot isLoading />
        </MemoryRouter>
      </IntlProvider>,
    );

    expect(screen.getByTestId('course-card')).toBeInTheDocument();
  });
});

describe('CourseCatalogDataTableSlots barrel', () => {
  it('re-exports the mixed dispatcher and the pathway card slot', () => {
    expect(CourseCatalogDataTableSlots.CourseCatalogDataTableCardSlot).toBe(CourseCatalogDataTableCardSlot);
    expect(CourseCatalogDataTableSlots.CourseCatalogDataTablePathwayCardSlot).toBe(CourseCatalogDataTablePathwayCardSlot);
  });
});
