import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Hites {
    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'celulares' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro-hogar' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecnologia' },
    ];

    static ITEMS_PER_PAGE = 48;
}