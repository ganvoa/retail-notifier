import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Abcdin {

    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Electro, minDiscount: 60, slug: 'electro' },
        { iterable: true, department: Department.LineaBlanca, minDiscount: 60, slug: 'linea-blanca/electrodomesticos' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'computacion/accesorios-computacion' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'computacion/impresoras-y-multifuncionales' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'computacion/tablets' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'computacion/notebooks' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'entretenimiento' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'telefonia/smartphones/todo-smartphones' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'telefonia/smartwatch' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 60, slug: 'telefonia/accesorios-telefonia' },
    ];

    static ITEMS_PER_PAGE = 36;
}