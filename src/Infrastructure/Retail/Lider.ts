import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Lider {

    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'Electrohogar' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'Tecno' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'Celulares' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'Computación' },
    ];

    static ITEMS_PER_PAGE = 100;
}