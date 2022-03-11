import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Paris {
    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecnologia' },
        { iterable: true, department: Department.LineaBlanca, minDiscount: 50, slug: 'linea-blanca/refrigeracion' },
    ];

    static ITEMS_PER_PAGE = 60;
}