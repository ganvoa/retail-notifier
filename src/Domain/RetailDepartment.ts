import { Department } from './Department';

export interface RetailDepartment {
  department: Department;
  minDiscount: number;
  slug: string;
  iterable: boolean;
}
