import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Lider {

    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 60, slug: 'Electrohogar' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'Tecno' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'Celulares' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'Computación' },
    ];

    static ITEMS_PER_PAGE = 100;
}