export interface ClassData {
  instructor: string;
  number: string;
  section: string;
  term: string;
  title: string;
  dept: string;
  a: number;
  b: number;
  c: number;
  d: number;
  f: number;
  avg: number;
  updatedAt: any;
  instructorId: string;
  id: string;
}

export interface Professor {
  id: string;
  name: string;
  updatedAt: Date;
}

export interface AddProfessorDataResponse {
  classesAdded: number;
}

export interface User {
  first: string;
  email: string;
  uid: string;
}
