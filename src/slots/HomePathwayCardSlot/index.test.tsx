import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getAppConfig, IntlProvider } from '@openedx/frontend-base';

import HomePathwayCardSlot from '.';

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAppConfig: jest.fn(),
}));

const mockGetAppConfig = getAppConfig as jest.Mock;

const pathway = {
  id: 'pathway-1',
  data: {
    content: { displayName: 'Web Development' },
    org: 'Open edX',
    courseCount: 2,
    imageUrl: '/pathway.jpg',
    start: '2024-04-01T00:00:00Z',
    categoryLabel: 'Bootcamp',
  },
};

const renderComponent = (props: React.ComponentProps<typeof HomePathwayCardSlot>) => render(
  <IntlProvider locale="en"><MemoryRouter><HomePathwayCardSlot {...props} /></MemoryRouter></IntlProvider>,
);

describe('HomePathwayCardSlot', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when the pathway pilot UI is disabled', () => {
    mockGetAppConfig.mockReturnValue({ ENABLE_PATHWAY_PILOT_UI: false });

    renderComponent({ original: pathway });

    expect(screen.queryByTestId('pathway-card')).not.toBeInTheDocument();
  });
});
