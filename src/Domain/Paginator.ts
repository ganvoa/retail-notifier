export class Paginator {
    constructor(
        readonly limit: number,
        private total: number,
        private offset: number = 0,
    ) { }

    next(): boolean {
        if (this.offset >= this.total) {
            return false;
        }

        this.offset += this.limit;
        return true;
    }

    getOffset(): number {
        return this.offset;
    }

    getPage(): number {
        return Math.floor(this.offset/this.limit) + 1;
    }

    getNumberOfPages(): number {
        return Math.ceil(this.total/this.limit);
    }

}