import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Abcdin {

    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro' },
        { iterable: true, department: Department.LineaBlanca, minDiscount: 50, slug: 'linea-blanca/electrodomesticos' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'computacion/accesorios-computacion' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'computacion/impresoras-y-multifuncionales' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'computacion/tablets' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'computacion/notebooks' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'entretenimiento' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'telefonia/smartphones/todo-smartphones' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'telefonia/smartwatch' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'telefonia/accesorios-telefonia' },
    ];

    static ITEMS_PER_PAGE = 36;
}