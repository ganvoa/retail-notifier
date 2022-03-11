import { Department } from "../../Domain/Department";
import { RetailDepartment } from "../../Domain/RetailDepartment";

export class Ripley {

    static DEPARTMENTS: RetailDepartment[] = [
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/celulares' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/computacion' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/mundo-gamer' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/fotografia-y-video' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/smart-home' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/smartwatches-y-smartbands' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/television' },
        { iterable: true, department: Department.Tecnologia, minDiscount: 50, slug: 'tecno/audio-y-musica' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/refrigeracion' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/lavanderia' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/climatizacion' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/aseo' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/smart-home' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/cocina' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/comercial-e-industrial' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/salud-y-bienestar' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/cuidado-personal' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/costura-y-bordado' },
        { iterable: true, department: Department.Electro, minDiscount: 50, slug: 'electro/electrodomesticos' },
    ];

    static ITEMS_PER_PAGE = 48;
}