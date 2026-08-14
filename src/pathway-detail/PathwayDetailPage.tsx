import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar, Badge, Button, Card, Collapsible, Container, Image, Layout, Nav, Stack,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Head } from '@src/generic/head';
import noCourseImg from '@src/assets/images/no-course-image.svg';
import { getFullImageUrl } from '@src/generic/course-card/utils';
import NotFoundPage from '@src/not-found-page/NotFoundPage';

import messages from './messages';
import { getPathwayDetail } from './data';

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
            <Nav.Link key={id} href={`#${id}`} className="pathway-detail-nav-link px-0">
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
                    <p className="mb-2">{course.description}</p>
                    <Button variant="outline-primary" size="sm" disabled>
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
            </aside>
          </Layout.Element>
        </Layout>
      </Container>
    </>
  );
};

export default PathwayDetailPage;
