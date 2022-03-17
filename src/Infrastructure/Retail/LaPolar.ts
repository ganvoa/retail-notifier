import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class LaPolar {
    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'tecnologia' },
        { iterable: true, department: Department.LineaBlanca, minDiscount: 60, slug: 'linea-blanca' },
    ];

    static ITEMS_PER_PAGE = 100;
}