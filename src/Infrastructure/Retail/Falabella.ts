import { Department } from '../../Domain/Department';
import { RetailDepartment } from '../../Domain/RetailDepartment';

export class Falabella {
  static DEPARTMENTS: RetailDepartment[] = [
    {
      iterable: true,
      department: Department.Electro,
      minDiscount: 60,
      slug: 'cat16510006/Electrohogar'
    },
    {
      iterable: true,
      department: Department.Tecnologia,
      minDiscount: 60,
      slug: 'cat7090034/Tecnologia'
    }
  ];

  static ITEMS_PER_PAGE = 48;
}
