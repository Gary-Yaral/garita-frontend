import { Driver } from "../interfaces/allTypes";
import { RestApiService } from "../services/rest-api.service";

export class Paginator {
  public totalRows: number = 0;
  public items: any[] = [];
  public perPages: number[] = [10, 20, 25, 50, 100]
  public pages: number[] = [];
  public itemsPerPage: number = this.perPages[0];
  public currentPage: number = 1;
  public path: string = ''
  public pathLoads: string = ''


  constructor() {}

  setTotal(totalRows: number) {
    this.totalRows = totalRows
    this.getTotalPages()
  }

  getCurrentPageItems(restApi: RestApiService, items: any[]) {
    const dataToSend = {
      current_page:this.currentPage,
      per_page: this.itemsPerPage
    }
    restApi.doPost(`${this.path}/${this.pathLoads}`, dataToSend).subscribe((data: any) => {
        if(!data.error) {
          if(data.drivers[0] === true) {
              items = data.drivers[1]
              console.log(data.drivers[1])
              console.log(items);

          }
        }
      })
  }

  getTotalPages() {
    let pages = 0
    if(this.totalRows > 0) {
      pages = this.totalRows / this.itemsPerPage
      if(pages%1 !== 0) {
        pages = parseInt(`${pages}`)+1
      }
    } else {
      pages = 1
    }
    this.pages = []
    for (let i = 0; i< pages;  i++) {
      this.pages.push(i+1)
    }
  }

  setCurrentPage(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

