import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Falabella {

    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'cat16510006/Electrohogar' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'cat16510006/Electrohogar' },
    ];

    static ITEMS_PER_PAGE = 48;
}