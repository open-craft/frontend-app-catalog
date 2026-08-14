import type { PathwayDetailData } from './types';

/**
 * Static Data Engineering fixture matching the approved FAL-4380 screenshots.
 * The first six courses and credentials reproduce the screenshot copy verbatim;
 * the final two exist to exercise the "See more" control.
 */
export const DATA_ENGINEERING_PATHWAY: PathwayDetailData = {
  id: 'data-engineering-fundamentals',
  name: 'Data Engineering Fundamentals',
  organization: 'MIT OpenCourseWare',
  description: 'Master the complete data engineering stack, from pipeline design and SQL to distributed computing and real-time streaming. Earn a Professional Certificate upon completion.',
  about: [
    'The Data Engineering Fundamentals pathway is designed for professionals looking to build scalable data infrastructure. You will learn to design, build, and maintain data pipelines that power real-time analytics and machine learning systems.',
    'Each course builds on the previous one, giving you a complete foundation in modern data engineering tools and practices used at leading technology companies.',
  ],
  isEnrolled: false,
  facts: [
    { label: 'Classes start', value: 'Mar 3, 2027' },
    { label: 'Courses', value: '8' },
    { label: 'Price', value: 'Free' },
    { label: 'Duration', value: '8 months' },
    { label: 'Pace', value: 'Self-paced' },
    { label: 'Certificates', value: '1' },
    { label: 'Badges', value: '1' },
  ],
  courses: [
    {
      id: 'introduction-to-data-pipelines',
      title: 'Introduction to Data Pipelines',
      summary: '2 weeks · Self-paced · 1 certificate',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'sql-for-data-engineers',
      title: 'SQL for Data Engineers',
      summary: '2 weeks · Self-paced · 1 badge',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'apache-spark-and-distributed-computing',
      title: 'Apache Spark and Distributed Computing',
      summary: '2 weeks · Self-paced · 1 certificate',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'cloud-data-warehousing',
      title: 'Cloud Data Warehousing',
      summary: '2 weeks · Self-paced · 1 certificate',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'real-time-streaming-with-kafka',
      title: 'Real-Time Streaming with Kafka',
      summary: '2 weeks · Self-paced · 1 badge',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'capstone-build-a-data-platform',
      title: 'Capstone: Build a Data Platform',
      summary: '2 weeks · Self-paced · 1 certificate',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'data-quality-and-testing',
      title: 'Data Quality and Testing',
      summary: '3 weeks · Self-paced · 1 badge',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
      id: 'mlops-for-data-pipelines',
      title: 'MLOps for Data Pipelines',
      summary: '3 weeks · Self-paced · 1 certificate',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ],
  credentials: [
    {
      id: 'certificate-introduction-to-data-pipelines',
      title: 'Earn a certificate for 50% or more',
      courseTitle: 'Course: Introduction to Data Pipelines',
    },
    {
      id: 'badge-sql-for-data-engineers',
      title: 'Earn a badge on completion',
      courseTitle: 'Course: SQL for Data Engineers',
    },
    {
      id: 'certificate-apache-spark-and-distributed-computing',
      title: 'Earn a certificate for 65% or more',
      courseTitle: 'Course: Apache Spark and Distributed Computing',
    },
    {
      id: 'certificate-cloud-data-warehousing',
      title: 'Earn a certificate on completion',
      courseTitle: 'Course: Cloud Data Warehousing',
    },
    {
      id: 'badge-real-time-streaming-with-kafka',
      title: 'Earn a badge for 50% or more',
      courseTitle: 'Course: Real-Time Streaming with Kafka',
    },
    {
      id: 'certificate-capstone-build-a-data-platform',
      title: 'Earn a certificate for 50% or more',
      courseTitle: 'Course: Capstone: Build a Data Platform',
    },
    {
      id: 'certificate-data-quality-and-testing',
      title: 'Earn a certificate on completion',
      courseTitle: 'Course: Data Quality and Testing',
    },
    {
      id: 'badge-mlops-for-data-pipelines',
      title: 'Earn a badge for 50% or more',
      courseTitle: 'Course: MLOps for Data Pipelines',
    },
  ],
  instructors: [
    {
      id: 'julian-theodore-kensington',
      name: 'Julian Theodore Kensington',
      role: 'Computational Systems at MIT OpenLearning',
    },
    {
      id: 'ingrid-rasmussen',
      name: 'Ingrid Rasmussen',
      role: 'Applied Mathematics at MIT OpenLearning',
    },
    {
      id: 'anika-devanshi-bhattacharya',
      name: 'Anika Devanshi Bhattacharya',
      role: 'Artificial Intelligence at MIT OpenLearning',
    },
    {
      id: 'adrian-holloway',
      name: 'Adrian Holloway',
      role: 'Mechanical Engineering at MIT OpenLearning',
    },
  ],
  faqs: [
    {
      id: 'question-1',
      question: 'Question 1',
      answer: 'This is where your text will go',
    },
    {
      id: 'question-2',
      question: 'Question 2',
      answer: 'This is where your text will go',
    },
    {
      id: 'question-3',
      question: 'Question 3',
      answer: 'This is where your text will go',
    },
  ],
  testimonials: [
    {
      id: 'jane-smith',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      attribution: 'Jane Smith',
    },
    {
      id: 'arvind-deshmukh',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      attribution: 'Arvind Deshmukh',
    },
  ],
};

/**
 * Returns a copy of the Data Engineering fixture for any nonempty pathway ID,
 * or undefined when the ID is blank. Static only; no API or query layer.
 */
export const getPathwayDetail = (pathwayId: string): PathwayDetailData | undefined => (
  pathwayId.trim()
    ? { ...DATA_ENGINEERING_PATHWAY, id: pathwayId }
    : undefined
);
