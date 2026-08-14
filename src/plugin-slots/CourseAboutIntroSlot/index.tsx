import { PluginSlot } from '@openedx/frontend-plugin-framework';
import type { CourseAboutDataPartial } from '@src/course-about/types';
import { CourseIntro } from '@src/course-about/course-intro/CourseIntro';

interface CourseAboutIntroSlotProps {
  courseAboutData: CourseAboutDataPartial;
  hideActions?: boolean;
}

const CourseAboutIntroSlot = ({ courseAboutData, hideActions = false }: CourseAboutIntroSlotProps) => (
  <PluginSlot
    id="org.openedx.frontend.catalog.course_about_page.intro"
    slotOptions={{
      mergeProps: true,
    }}
    pluginProps={{ courseAboutData, hideActions }}
  >
    <CourseIntro courseAboutData={courseAboutData} hideActions={hideActions} />
  </PluginSlot>
);

export default CourseAboutIntroSlot;
