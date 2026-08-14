import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import {
  render, screen, waitFor, userEvent,
} from '@src/setupTest';
import { mockCourseAboutResponse } from '@src/__mocks__';
import { useEnrollment } from '@src/course-about/data/hooks';
import { CourseIntro } from './CourseIntro';
import messages from './messages';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@src/course-about/data/hooks', () => ({
  useEnrollment: jest.fn(),
}));

describe('CourseIntro', () => {
  const mockEnrollAndRedirect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthenticatedUser as jest.Mock).mockReturnValue(null);
    (useEnrollment as jest.Mock).mockReturnValue(mockEnrollAndRedirect);
  });

  it('renders course information correctly', () => {
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    expect(screen.getByText(mockCourseAboutResponse.name)).toBeInTheDocument();
    expect(screen.getByText(mockCourseAboutResponse.org)).toBeInTheDocument();
    expect(screen.getByText(mockCourseAboutResponse.shortDescription)).toBeInTheDocument();
  });

  it('renders enrollment button for eligible users', async () => {
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage })).toBeInTheDocument();
    });
  });

  it('handles enrollment action correctly', async () => {
    mockEnrollAndRedirect.mockResolvedValueOnce(undefined);
    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    const enrollButton = await screen.findByRole('button', { name: messages.enrollNowBtn.defaultMessage });
    userEvent.click(enrollButton);

    await waitFor(() => {
      expect(mockEnrollAndRedirect).toHaveBeenCalledWith(
        mockCourseAboutResponse.id,
        `${getConfig().LMS_BASE_URL}/dashboard`,
      );
    });
  });

  it('renders enrolled status for authenticated active users', async () => {
    (getAuthenticatedUser as jest.Mock).mockReturnValue({ username: 'testuser' });
    const enrolledCourseData = {
      ...mockCourseAboutResponse,
      enrollment: { isActive: true },
    };

    render(<CourseIntro courseAboutData={enrolledCourseData} />);

    await waitFor(() => {
      expect(screen.getByText(messages.statusMessageEnrolled.defaultMessage)).toBeInTheDocument();
    });
  });

  it('handles authenticated user correctly', async () => {
    const mockUser = { username: 'testuser' };
    (getAuthenticatedUser as jest.Mock).mockReturnValue(mockUser);

    render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

    await waitFor(() => {
      expect(screen.getByRole('button', {
        name: messages.enrollNowBtn.defaultMessage,
      })).toBeInTheDocument();
    });
  });

  describe('hideActions', () => {
    it('renders course information without action footer', () => {
      render(<CourseIntro courseAboutData={mockCourseAboutResponse} hideActions />);

      expect(screen.getByText(mockCourseAboutResponse.name)).toBeInTheDocument();
      expect(screen.getByText(mockCourseAboutResponse.org)).toBeInTheDocument();
      expect(screen.getByText(mockCourseAboutResponse.shortDescription)).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(document.querySelector('.pgn__card-footer')).not.toBeInTheDocument();
    });

    it('does not mount enrollment or auth hooks when actions are hidden', () => {
      render(<CourseIntro courseAboutData={mockCourseAboutResponse} hideActions />);

      expect(getAuthenticatedUser).not.toHaveBeenCalled();
      expect(useEnrollment).not.toHaveBeenCalled();
    });

    it('renders actions by default', async () => {
      render(<CourseIntro courseAboutData={mockCourseAboutResponse} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage })).toBeInTheDocument();
      });
      expect(getAuthenticatedUser).toHaveBeenCalled();
    });
  });
});
