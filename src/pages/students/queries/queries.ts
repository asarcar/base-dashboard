// src/pages/students/queries/queries.ts
import { getStudents } from '@/lib/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

/**
 * Based on the @/lib/api reference to slingacademy API,
 * the actual user object structure for API
 * https://api.slingacademy.com/v1/sample-data/users
 * is as below:
 *
 * Student {
 *   "id":1,
 *   "first_name":"Kayla",
 *   "last_name":"Lopez",
 *   "email":"kayla.lopez.1@slingacademy.com",
 *   "gender": "female",
 *   "date_of_birth":"2002-04-26T00:00:00",
 *   "street":"3388 Roger Wells Apt. 010",
 *   "city":"Humphreyfurt",
 *   "job":"Herbalist",
 *   "zipcode":"79574",
 *   "latitude":13.032103,
 *   "profile_picture":"https://api.slingacademy.com/public/sample-users/1.png",
 *   "phone":"+1-697-415-3345x5215",
 *   "state":"Vermont",
 *   "country":"Jordan",
 *   "longitude":112.16014
 * }
 */
export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  street: string;
  city: string;
  job: string;
  zipcode: string;
  latitude: number;
  profile_picture: string;
  phone: string;
  state: string;
  country: string;
  longitude: number;
}

export interface StudentResponse {
  success: boolean;
  time: string;
  message: string;
  total_users: number;
  offset: number;
  limit: number;
  users: Student[];
}

/**
 * StudentFeedTable: src/pages/students/components/student-feed-table/index.tsx
 * StudentTable: src/pages/students/components/students-table/index.tsx
 */
export interface TStudentsTableProps {
  users: Student[] | undefined;
  page: number;
  totalUsers: number;
  pageCount: number;
}

export const useGetStudents = (
  offset: number,
  pageLimit: number,
  country: string
): UseQueryResult<StudentResponse, Error> => {
  return useQuery({
    queryKey: ['students', offset, pageLimit, country],
    queryFn: async () => getStudents(offset, pageLimit, country)
  });
};
