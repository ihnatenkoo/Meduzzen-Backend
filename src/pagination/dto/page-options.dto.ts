type SortType = 'ASC' | 'DESC';

export class PageOptionsDto {
  readonly page: number;
  readonly limit: number;
  readonly sort: SortType;

  constructor(page: number = 1, limit: number = 10, sort: SortType = 'ASC') {
    this.page = page;
    this.limit = limit;
    this.sort = sort;
  }

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
