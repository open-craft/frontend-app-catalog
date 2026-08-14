import { Route, Routes } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import noCourseImg from '@src/assets/images/no-course-image.svg';

import {
  render, screen, userEvent, within,
} from '../setupTest';
import { ROUTES } from '../routes';
import PathwayDetailPage, { INITIAL_VISIBLE_COUNT } from './PathwayDetailPage';
import { DATA_ENGINEERING_PATHWAY, getPathwayDetail } from './data';
import messages from './messages';

let mockIsEnrolled: boolean | undefined;

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({ SITE_NAME: 'Example Site', LMS_BASE_URL: 'http://example.com' })),
}));

jest.mock('./data', () => {
  const actual = jest.requireActual('./data');
  return {
    ...actual,
    getPathwayDetail: (pathwayId: string) => {
      const pathway = actual.getPathwayDetail(pathwayId);
      return pathway && mockIsEnrolled !== undefined
        ? { ...pathway, isEnrolled: mockIsEnrolled }
        : pathway;
    },
  };
});

const getSection = (heading: string) => (
  screen.getByRole('heading', { name: heading }).closest('section') as HTMLElement
);

const renderPathwayDetailPage = () => render(
  <Routes>
    <Route path={ROUTES.PATHWAY_DETAIL} element={<PathwayDetailPage />} />
  </Routes>,
);

describe('PathwayDetailPage', () => {
  beforeEach(() => {
    mockIsEnrolled = undefined;
    window.testHistory = ['/pathways/pathway-1'];
  });

  it('renders the Data Engineering fixture for the route pathway ID', () => {
    renderPathwayDetailPage();

    expect(screen.getByRole('heading', { level: 1, name: DATA_ENGINEERING_PATHWAY.name })).toBeInTheDocument();
    expect(screen.getByText(DATA_ENGINEERING_PATHWAY.organization)).toBeInTheDocument();
    expect(screen.getByText(DATA_ENGINEERING_PATHWAY.description)).toBeInTheDocument();
    expect(screen.getByText(messages.pathwayBadge.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: DATA_ENGINEERING_PATHWAY.name })).toBeInTheDocument();

    [
      messages.aboutHeading,
      messages.credentialsHeading,
      messages.instructorsHeading,
      messages.faqsHeading,
      messages.testimonialsHeading,
    ].forEach((message) => {
      expect(screen.getByRole('heading', { name: message.defaultMessage })).toBeInTheDocument();
    });

    // One presentational Paragon Avatar per instructor: empty alt (names are
    // adjacent) and the default silhouette fallback (fixture has no images).
    const instructorsSection = getSection(messages.instructorsHeading.defaultMessage);
    expect(instructorsSection.querySelectorAll('.pgn__avatar')).toHaveLength(DATA_ENGINEERING_PATHWAY.instructors.length);

    [
      { message: messages.aboutNavLink, hash: '#about' },
      { message: messages.credentialsNavLink, hash: '#credentials' },
      { message: messages.instructorsNavLink, hash: '#instructors' },
      { message: messages.faqsNavLink, hash: '#faqs' },
      { message: messages.testimonialsNavLink, hash: '#testimonials' },
    ].forEach(({ message, hash }) => {
      expect(screen.getByRole('link', { name: message.defaultMessage })).toHaveAttribute('href', hash);
    });

    expect(screen.getByText(DATA_ENGINEERING_PATHWAY.facts[0].value)).toBeInTheDocument();

    // Counts shown to the learner stay in sync with the fixture, not hardcoded copy.
    const coursesFact = DATA_ENGINEERING_PATHWAY.facts.find((fact) => fact.label === 'Courses');
    expect(coursesFact?.value).toBe(String(DATA_ENGINEERING_PATHWAY.courses.length));
    expect(screen.getByText(`Complete these ${DATA_ENGINEERING_PATHWAY.courses.length} courses in any order`)).toBeInTheDocument();

    // Fixture shape matches the confirmed decisions.
    expect(DATA_ENGINEERING_PATHWAY.courses).toHaveLength(8);
    expect(DATA_ENGINEERING_PATHWAY.credentials).toHaveLength(8);
    expect(DATA_ENGINEERING_PATHWAY.instructors).toHaveLength(4);
    expect(DATA_ENGINEERING_PATHWAY.faqs).toHaveLength(3);
    expect(DATA_ENGINEERING_PATHWAY.testimonials).toHaveLength(2);
    expect(DATA_ENGINEERING_PATHWAY.isEnrolled).toBe(false);
  });

  it('substitutes any nonempty pathway ID into the fixture and rejects blank IDs', () => {
    expect(getPathwayDetail('some-id')?.id).toBe('some-id');
    expect(getPathwayDetail('')).toBeUndefined();
    expect(getPathwayDetail('   ')).toBeUndefined();
  });

  it('falls back to the placeholder image once and does not retry on repeated errors', () => {
    renderPathwayDetailPage();
    const image = screen.getByRole('img', { name: DATA_ENGINEERING_PATHWAY.name });
    const setSrc = jest.spyOn(HTMLImageElement.prototype, 'src', 'set');

    // Fixture has no imageUrl, so start from a broken remote URL to exercise the fallback.
    image.setAttribute('src', 'http://example.com/broken.jpg');
    fireEvent.error(image);
    fireEvent.error(image);

    expect(setSrc).toHaveBeenCalledTimes(1);
    expect(image).toHaveAttribute('src', noCourseImg);
    setSrc.mockRestore();
  });

  it('renders only a disabled "Enroll now" CTA when not enrolled', () => {
    renderPathwayDetailPage();

    expect(screen.getByRole('button', { name: messages.enrollNowBtn.defaultMessage })).toBeDisabled();
    expect(screen.queryByRole('button', { name: messages.viewPathwayBtn.defaultMessage })).not.toBeInTheDocument();
  });

  it('renders only a disabled "View pathway" CTA when enrolled', () => {
    mockIsEnrolled = true;
    renderPathwayDetailPage();

    expect(screen.getByRole('button', { name: messages.viewPathwayBtn.defaultMessage })).toBeDisabled();
    expect(screen.queryByRole('button', { name: messages.enrollNowBtn.defaultMessage })).not.toBeInTheDocument();
  });

  it('shows 6 courses and credentials by default and expands each list independently', async () => {
    renderPathwayDetailPage();

    const aboutSection = getSection(messages.aboutHeading.defaultMessage);
    const credentialsSection = getSection(messages.credentialsHeading.defaultMessage);
    const { courses, credentials } = DATA_ENGINEERING_PATHWAY;
    const lastVisibleCourse = courses[INITIAL_VISIBLE_COUNT - 1].title;
    const firstHiddenCourse = courses[INITIAL_VISIBLE_COUNT].title;
    const lastVisibleCredential = credentials[INITIAL_VISIBLE_COUNT - 1].courseTitle;
    const firstHiddenCredential = credentials[INITIAL_VISIBLE_COUNT].courseTitle;

    expect(within(aboutSection).getByText(lastVisibleCourse)).toBeInTheDocument();
    expect(within(aboutSection).queryByText(firstHiddenCourse)).not.toBeInTheDocument();
    expect(within(credentialsSection).getByText(lastVisibleCredential)).toBeInTheDocument();
    expect(within(credentialsSection).queryByText(firstHiddenCredential)).not.toBeInTheDocument();

    // Expanding courses does not change credentials.
    await userEvent.click(within(aboutSection).getByRole('button', { name: messages.seeMoreBtn.defaultMessage }));
    expect(within(aboutSection).getByText(courses[7].title)).toBeInTheDocument();
    expect(within(aboutSection).getByRole('button', { name: messages.seeLessBtn.defaultMessage })).toBeInTheDocument();
    expect(within(credentialsSection).queryByText(firstHiddenCredential)).not.toBeInTheDocument();

    // Expanding credentials does not change courses.
    await userEvent.click(within(credentialsSection).getByRole('button', { name: messages.seeMoreBtn.defaultMessage }));
    expect(within(credentialsSection).getByText(credentials[7].courseTitle)).toBeInTheDocument();
    expect(within(aboutSection).getByText(courses[7].title)).toBeInTheDocument();

    // Each "See less" independently collapses its own list.
    await userEvent.click(within(aboutSection).getByRole('button', { name: messages.seeLessBtn.defaultMessage }));
    expect(within(aboutSection).queryByText(firstHiddenCourse)).not.toBeInTheDocument();
    expect(within(credentialsSection).getByText(credentials[7].courseTitle)).toBeInTheDocument();

    await userEvent.click(within(credentialsSection).getByRole('button', { name: messages.seeLessBtn.defaultMessage }));
    expect(within(credentialsSection).queryByText(firstHiddenCredential)).not.toBeInTheDocument();
  });

  it('keeps course and FAQ disclosures independent', async () => {
    renderPathwayDetailPage();

    const aboutSection = getSection(messages.aboutHeading.defaultMessage);
    const faqsSection = getSection(messages.faqsHeading.defaultMessage);
    const { courses, faqs } = DATA_ENGINEERING_PATHWAY;

    // Closed initially: each trigger is a button that reports itself collapsed
    // and its body is unmounted. Course descriptions are identical fixture
    // lorem ipsum, so all body assertions are scoped to one collapsible card.
    const firstCourseTrigger = within(aboutSection).getByRole('button', {
      name: (name) => name.includes(courses[0].title),
    });
    const secondCourseTrigger = within(aboutSection).getByRole('button', {
      name: (name) => name.includes(courses[1].title),
    });
    const firstCourse = firstCourseTrigger.closest('.collapsible-card') as HTMLElement;
    const secondCourse = secondCourseTrigger.closest('.collapsible-card') as HTMLElement;
    expect(firstCourseTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(secondCourseTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(within(firstCourse).queryByText(courses[0].description)).not.toBeInTheDocument();

    // Opening one course mounts only its body.
    await userEvent.click(firstCourseTrigger);
    expect(firstCourseTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(secondCourseTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(within(firstCourse).getByText(courses[0].description)).toBeVisible();
    expect(within(firstCourse).getByRole('button', { name: messages.learnMoreBtn.defaultMessage })).toBeDisabled();
    expect(within(secondCourse).queryByText(courses[1].description)).not.toBeInTheDocument();

    // Opening a second course keeps the first open.
    await userEvent.click(secondCourseTrigger);
    expect(firstCourseTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(secondCourseTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(firstCourse).getByText(courses[0].description)).toBeVisible();
    expect(within(secondCourse).getByText(courses[1].description)).toBeVisible();

    // FAQs open independently of each other and stay open together.
    const firstFaqTrigger = within(faqsSection).getByRole('button', { name: faqs[0].question });
    const secondFaqTrigger = within(faqsSection).getByRole('button', { name: faqs[1].question });
    const firstFaq = firstFaqTrigger.closest('.collapsible-basic') as HTMLElement;
    const secondFaq = secondFaqTrigger.closest('.collapsible-basic') as HTMLElement;
    expect(firstFaqTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(secondFaqTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(within(firstFaq).queryByText(faqs[0].answer)).not.toBeInTheDocument();

    await userEvent.click(firstFaqTrigger);
    await userEvent.click(secondFaqTrigger);
    expect(firstFaqTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(secondFaqTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(firstFaq).getByText(faqs[0].answer)).toBeVisible();
    expect(within(secondFaq).getByText(faqs[1].answer)).toBeVisible();
  });
});
