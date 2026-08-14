import { useLocation } from 'react-router';
import {
  Container, Alert,
} from '@openedx/paragon';
import { ErrorPage } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Loading, Head } from '@src/generic';
import { useCourseAboutData } from './data/hooks';
import CourseAboutBody from './CourseAboutBody';
import messages from './messages';

const CourseAboutPage = () => {
  const intl = useIntl();
  const courseId = useLocation().pathname.split('/')[2];
  const {
    data: courseAboutData,
    isLoading,
    isError,
  } = useCourseAboutData(courseId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Container className="py-5.5">
        <Alert variant="danger">
          <ErrorPage
            message={intl.formatMessage(messages.errorMessage, {
              supportEmail: getConfig().INFO_EMAIL,
            })}
          />
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Head title={courseAboutData?.name || ''} />
      <Container fluid={false} size="xl" className="py-5.5">
        <CourseAboutBody courseAboutData={courseAboutData} />
      </Container>
    </>
  );
};

export default CourseAboutPage;
