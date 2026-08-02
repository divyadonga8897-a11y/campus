// ============================================================
// TypeScript Types for CampusConnect AI
// ============================================================

export interface Department {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  hod: string;
  hodQualification: string;
  facultyCount: number;
  intake: number;
  established: number;
  labs: readonly string[];
  majorSubjects: readonly string[];
  careerOpportunities: readonly string[];
  researchAreas: readonly string[];
}

export interface Course {
  id: string;
  name: string;
  department: string;
  departmentName: string;
  slug: string;
  duration: string;
  intake: number;
  type: string;
  eligibility: readonly string[];
  description: string;
  curriculum: Record<string, readonly string[]>;
  careerOpportunities: readonly string[];
  higherStudies: readonly string[];
  icon: string;
}

export interface FeeStructure {
  courseId: string;
  courseName: string;
  department: string;
  academicYear: string;
  tuitionFee: number;
  hostelFee: number;
  transportFee: number;
  examinationFee: number;
  otherCharges: number;
  totalFee: number;
  scholarshipAvailable: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  type: string;
  icon: string;
  eligibility: readonly string[];
  benefits: readonly string[];
  applicationProcess: readonly string[];
  documentsRequired: readonly string[];
  deadline: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface StatCard {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface Achievement {
  category: string;
  icon: string;
  title: string;
  description: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

export interface Facility {
  name: string;
  icon: string;
  description: string;
  image: string;
}
