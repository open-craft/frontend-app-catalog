import { useEffect, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar, Badge, Button, Card, Collapsible, Container, Image, Layout, ModalDialog, Nav, Stack,
} from '@openedx/paragon';
import {
  BsFacebook as BsFacebookIcon,
  BsTwitterX as BsTwitterXIcon,
  Email as EmailIcon,
} from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Head } from '@src/generic/head';
import noCourseImg from '@src/assets/images/no-course-image.svg';
import { getFullImageUrl } from '@src/generic/course-card/utils';
import SocialLinks from '@src/course-about/course-sidebar/sidebar-social/SocialLinks';
import type { SocialLink } from '@src/course-about/course-sidebar/sidebar-social/types';
import { getFacebookShareUrl } from '@src/course-about/course-sidebar/sidebar-social/utils';
import CourseAboutBody from '@src/course-about/CourseAboutBody';
import NotFoundPage from '@src/not-found-page/NotFoundPage';

import messages from './messages';
import { getPathwayDetail } from './data';
import type { PathwayCourse } from './types';

/** Number of courses and credentials shown before a list is expanded. */
export const INITIAL_VISIBLE_COUNT = 6;

const SECTION_NAV_ITEMS = [
  { id: 'about', message: messages.aboutNavLink },
  { id: 'credentials', message: messages.credentialsNavLink },
  { id: 'instructors', message: messages.instructorsNavLink },
  { id: 'faqs', message: messages.faqsNavLink },
  { id: 'testimonials', message: messages.testimonialsNavLink },
];

/**
 * Responsive Bootstrap grid config for the two page columns, mirroring
 * CourseAboutPage's Layout usage: stacked on mobile, 9/3 split at lg and up.
 */
const PAGE_LAYOUT = {
  xs: [{ span: 12 }, { span: 12 }],
  lg: [{ span: 9 }, { span: 3 }],
};

const PathwayDetailPage = () => {
  const intl = useIntl();
  const { pathwayId } = useParams<{ pathwayId: string }>();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllCredentials, setShowAllCredentials] = useState(false);
  const [activeSection, setActiveSection] = useState<string>();
  // The course whose Learn-more modal is open; null keeps the dialog closed.
  // Deliberately page-local state: the modal never touches the URL or history.
  const [selectedCourse, setSelectedCourse] = useState<PathwayCourse | null>(null);
  const intersectingSections = useRef(new Set<string>());

  // Page-local scrollspy: one IntersectionObserver watches the five section
  // targets. The nav height is read from the same CSS custom property used for
  // scroll-margin-top (px unit keeps it valid as a rootMargin length), so the
  // JS and CSS offsets cannot drift.
  useEffect(() => {
    // Paragon Nav does not forward refs to its DOM element, so resolve it
    // directly; this page renders exactly one section navigation.
    const nav = document.querySelector<HTMLElement>('.pathway-detail-nav');
    const sections = SECTION_NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!nav || sections.length === 0) {
      return undefined;
    }

    const navHeight = parseFloat(getComputedStyle(nav).getPropertyValue('--pathway-detail-nav-height'));
    const stickyBoundary = Number.isFinite(navHeight) ? navHeight : 0;

    // Mirror the active section in the URL hash without adding a history
    // entry per scroll event; pathname and query are preserved. This runs
    // before setActiveSection so the re-render reads the already-synced URL
    // (share destinations are built from window.location.href).
    const syncHash = (sectionId: string) => {
      const hash = `#${sectionId}`;
      if (window.location.hash !== hash) {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${hash}`);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersectingSections.current.add(entry.target.id);
        } else {
          intersectingSections.current.delete(entry.target.id);
        }
      });

      // Several sections can intersect at once. Pick the one nearest the
      // sticky boundary (the nav's bottom edge); a strictly-smaller
      // comparison keeps the first matching section on ties, so the choice
      // is deterministic and does not flicker. Geometry is read fresh from
      // the live DOM: entry.boundingClientRect is stale between callbacks.
      let nearestId: string | undefined;
      let nearestDistance = Infinity;
      SECTION_NAV_ITEMS.forEach(({ id }) => {
        if (!intersectingSections.current.has(id)) {
          return;
        }
        const section = document.getElementById(id);
        if (!section) {
          return;
        }
        const distance = Math.abs(section.getBoundingClientRect().top - stickyBoundary);
        if (distance < nearestDistance) {
          nearestId = id;
          nearestDistance = distance;
        }
      });
      // Keep the current section active while none intersect (e.g. the page
      // footer) rather than flickering the active link off.
      if (nearestId) {
        syncHash(nearestId);
        setActiveSection(nearestId);
      }
    }, { rootMargin: `-${stickyBoundary}px 0px 0px 0px` });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const pathway = pathwayId ? getPathwayDetail(pathwayId) : undefined;

  if (!pathway) {
    return <NotFoundPage />;
  }

  const visibleCourses = pathway.courses.slice(0, showAllCourses ? undefined : INITIAL_VISIBLE_COUNT);
  const visibleCredentials = pathway.credentials.slice(0, showAllCredentials ? undefined : INITIAL_VISIBLE_COUNT);

  const handleHeroImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    // Compare the raw attribute: img.src is resolved to an absolute URL, so
    // it never equals the imported (relative) placeholder path and would
    // otherwise re-assign forever on repeated errors.
    if (img.getAttribute('src') !== noCourseImg) {
      img.src = noCourseImg;
    }
  };

  // Read during render so observer-driven hash changes (synced before
  // setActiveSection) are reflected in the share destinations.
  const shareUrl = window.location.href;
  const socialLinks: SocialLink[] = [
    {
      id: 'facebook',
      destination: getFacebookShareUrl(),
      icon: BsFacebookIcon,
      screenReaderText: intl.formatMessage(messages.shareFacebookLabel),
    },
    {
      id: 'twitter',
      destination: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        intl.formatMessage(messages.shareTwitterText, { pathwayName: pathway.name, url: shareUrl }),
      )}`,
      icon: BsTwitterXIcon,
      screenReaderText: intl.formatMessage(messages.shareTwitterLabel),
    },
    {
      id: 'email',
      destination: `mailto:?subject=${encodeURIComponent(
        intl.formatMessage(messages.shareEmailSubject, { pathwayName: pathway.name }),
      )}&body=${encodeURIComponent(
        intl.formatMessage(messages.shareEmailBody, { pathwayName: pathway.name, url: shareUrl }),
      )}`,
      icon: EmailIcon,
      screenReaderText: intl.formatMessage(messages.shareEmailLabel),
    },
  ];

  return (
    <>
      <Head title={pathway.name} />
      <Container fluid={false} size="xl" className="pathway-detail-page py-5.5">
        <header className="pathway-detail-hero d-flex flex-column flex-lg-row align-items-lg-start gap-3">
          <div className="pathway-detail-hero-content d-flex flex-column gap-3">
            <div>
              <Badge variant="light">{intl.formatMessage(messages.pathwayBadge)}</Badge>
            </div>
            <h1 className="h2 mb-0">{pathway.name}</h1>
            <div className="text-muted">{pathway.organization}</div>
            <p className="mb-0">{pathway.description}</p>
            <div>
              <Button disabled>
                {intl.formatMessage(pathway.isEnrolled ? messages.viewPathwayBtn : messages.enrollNowBtn)}
              </Button>
            </div>
          </div>
          <Image
            className="pathway-detail-hero-image"
            src={getFullImageUrl(pathway.imageUrl) || noCourseImg}
            alt={pathway.name}
            onError={handleHeroImageError}
          />
        </header>
        <Nav
          as="nav"
          aria-label={intl.formatMessage(messages.sectionsNavLabel)}
          className="pathway-detail-nav align-items-center gap-4 mt-4"
        >
          {SECTION_NAV_ITEMS.map(({ id, message }) => (
            <Nav.Link
              key={id}
              href={`#${id}`}
              className="pathway-detail-nav-link px-0"
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {intl.formatMessage(message)}
            </Nav.Link>
          ))}
        </Nav>
        <Layout {...PAGE_LAYOUT}>
          <Layout.Element className="d-flex flex-column gap-5 mt-4 mb-4 mb-lg-0">
            <section id="about" className="pathway-detail-section d-flex flex-column gap-3">
              <h2 className="h3 mb-0">{intl.formatMessage(messages.aboutHeading)}</h2>
              {pathway.about.map((paragraph) => (
                <p key={paragraph} className="mb-0">{paragraph}</p>
              ))}
              <p className="font-weight-bold mb-0">
                {intl.formatMessage(messages.completeCoursesNote, { count: pathway.courses.length })}
              </p>
              <h3 className="h4 mt-2">{intl.formatMessage(messages.coursesHeading)}</h3>
              <div id="pathway-courses-list" className="d-flex flex-column gap-2">
                {visibleCourses.map((course) => (
                  <Collapsible
                    key={course.id}
                    styling="card"
                    title={(
                      <span className="d-flex justify-content-between flex-wrap gap-2 flex-grow-1">
                        <span className="font-weight-bold">{course.title}</span>
                        <span className="text-muted">{course.summary}</span>
                      </span>
                    )}
                  >
                    <p className="mb-2">{course.courseAboutData.shortDescription}</p>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedCourse(course)}>
                      {intl.formatMessage(messages.learnMoreBtn)}
                    </Button>
                  </Collapsible>
                ))}
              </div>
              {pathway.courses.length > INITIAL_VISIBLE_COUNT && (
                <div>
                  <Button
                    variant="link"
                    aria-expanded={showAllCourses}
                    aria-controls="pathway-courses-list"
                    onClick={() => setShowAllCourses((current) => !current)}
                  >
                    {intl.formatMessage(showAllCourses ? messages.seeLessBtn : messages.seeMoreBtn)}
                  </Button>
                </div>
              )}
            </section>
            <section id="credentials" className="pathway-detail-section d-flex flex-column gap-3">
              <h2 className="h3 mb-0">{intl.formatMessage(messages.credentialsHeading)}</h2>
              <div id="pathway-credentials-list" className="pathway-detail-credentials">
                {visibleCredentials.map((credential) => (
                  <Card key={credential.id}>
                    <Card.Header title={credential.title} subtitle={credential.courseTitle} size="sm" />
                  </Card>
                ))}
              </div>
              {pathway.credentials.length > INITIAL_VISIBLE_COUNT && (
                <div>
                  <Button
                    variant="link"
                    aria-expanded={showAllCredentials}
                    aria-controls="pathway-credentials-list"
                    onClick={() => setShowAllCredentials((current) => !current)}
                  >
                    {intl.formatMessage(showAllCredentials ? messages.seeLessBtn : messages.seeMoreBtn)}
                  </Button>
                </div>
              )}
            </section>
            <section id="instructors" className="pathway-detail-section d-flex flex-column gap-3">
              <h2 className="h3 mb-0">{intl.formatMessage(messages.instructorsHeading)}</h2>
              {pathway.instructors.map((instructor) => (
                <div key={instructor.id} className="d-flex align-items-center gap-3">
                  <Avatar alt="" size="sm" className="flex-shrink-0" />
                  <div>
                    <div className="font-weight-bold">{instructor.name}</div>
                    <div>{instructor.role}</div>
                  </div>
                </div>
              ))}
            </section>
            <section id="faqs" className="pathway-detail-section d-flex flex-column">
              <h2 className="h3 mb-3">{intl.formatMessage(messages.faqsHeading)}</h2>
              {pathway.faqs.map((faq) => (
                <Collapsible key={faq.id} styling="basic" className="pathway-detail-faq" title={faq.question}>
                  <p className="mb-0">{faq.answer}</p>
                </Collapsible>
              ))}
            </section>
            <section id="testimonials" className="pathway-detail-section d-flex flex-column gap-3">
              <h2 className="h3 mb-0">{intl.formatMessage(messages.testimonialsHeading)}</h2>
              {pathway.testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <Card.Body>
                    <figure className="m-0">
                      <blockquote className="mb-2">{testimonial.quote}</blockquote>
                      <figcaption className="font-weight-bold">{testimonial.attribution}</figcaption>
                    </figure>
                  </Card.Body>
                </Card>
              ))}
            </section>
          </Layout.Element>
          <Layout.Element className="align-self-start mt-lg-4">
            <aside aria-label={intl.formatMessage(messages.factsAriaLabel)}>
              <Card>
                <Card.Body className="p-0">
                  {pathway.facts.map((fact) => (
                    <div key={fact.label}>
                      <Stack direction="horizontal" className="justify-content-between flex-wrap p-3" gap={2}>
                        <span>{fact.label}</span>
                        <span className="font-weight-bold">{fact.value}</span>
                      </Stack>
                      <Card.Divider />
                    </div>
                  ))}
                </Card.Body>
              </Card>
              <div className="mt-4">
                <h3 className="h6 mb-2">{intl.formatMessage(messages.shareHeading)}</h3>
                <Stack direction="horizontal" gap={3}>
                  <SocialLinks socialLinks={socialLinks} />
                </Stack>
              </div>
            </aside>
          </Layout.Element>
        </Layout>
        <ModalDialog
          title={selectedCourse
            ? intl.formatMessage(messages.courseModalTitle, { courseTitle: selectedCourse.title })
            : ''}
          isOpen={selectedCourse !== null}
          onClose={() => setSelectedCourse(null)}
          size="xl"
          // Dark variant styles the header with white text and inverts the
          // close button to white; only the header tint is overridden in
          // PathwayDetailPage.scss, the dialog body stays white.
          variant="dark"
          isOverflowVisible={false}
          // Near-full-screen below the md breakpoint while keeping the close
          // control; the default 80vh cap plus the internally scrollable
          // ModalDialog.Body bounds the dialog on larger screens.
          isFullscreenOnMobile
          className="pathway-detail-course-modal"
        >
          {selectedCourse && (
            <>
              <ModalDialog.Header>
                {/* Non-heading element: the banner is a compact bar, not a page heading. */}
                <ModalDialog.Title as="p">
                  {intl.formatMessage(messages.courseModalContextBanner, {
                    pathwayName: <strong>{pathway.name}</strong>,
                  })}
                </ModalDialog.Title>
              </ModalDialog.Header>
              <ModalDialog.Body>
                <CourseAboutBody
                  courseAboutData={selectedCourse.courseAboutData}
                  hideActions
                />
              </ModalDialog.Body>
            </>
          )}
        </ModalDialog>
      </Container>
    </>
  );
};

export default PathwayDetailPage;
