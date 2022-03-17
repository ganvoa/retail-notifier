import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Paris {
    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 60, slug: 'electro' },
        { iterable: true, department: Department.Zapatillas, minDiscount: 60, slug: 'zapatos/zapatillas' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'tecnologia' },
        { iterable: true, department: Department.LineaBlanca, minDiscount: 60, slug: 'linea-blanca/refrigeracion' },
    ];

    static ITEMS_PER_PAGE = 60;
}