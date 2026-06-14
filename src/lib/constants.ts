export interface CareerProfile {
  id: string;
  name: string;
  riasec: string;
  match: number;
}

export const targetCareers: CareerProfile[] = [
  { id: 'swe', name: 'Software Engineer', riasec: 'Investigative, Realistic', match: 92 },
  { id: 'frontend', name: 'Frontend Developer', riasec: 'Artistic, Realistic', match: 88 },
  { id: 'backend', name: 'Backend Developer', riasec: 'Investigative, Realistic', match: 90 },
  { id: 'fullstack', name: 'Full Stack Developer', riasec: 'Realistic, Investigative', match: 91 },
  { id: 'da', name: 'Data Analyst', riasec: 'Conventional, Investigative', match: 82 },
  { id: 'ds', name: 'Data Scientist', riasec: 'Investigative, Conventional', match: 88 },
  { id: 'ai', name: 'AI Engineer', riasec: 'Investigative, Artistic', match: 89 },
  { id: 'ml', name: 'Machine Learning Engineer', riasec: 'Investigative, Realistic', match: 91 },
  { id: 'pm', name: 'Product Manager', riasec: 'Enterprising, Social', match: 85 },
  { id: 'ux', name: 'UX Designer', riasec: 'Artistic, Investigative', match: 84 }
];
