import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CAMERA_PATH } from 'src/app/config/constants';
import { Driver, driverKey } from 'src/app/interfaces/allTypes';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Paginator } from 'src/app/utilities/paginator';

@Component({
  selector: 'app-table-common',
  templateUrl: './table-common.component.html',
  styleUrls: ['./table-common.component.css']
})
export class TableCommonComponent {
  @Input() sectionName: string = '';
  @Input() path: string = '';
  @Input() pathLoads: string = '';
  @Input() theads: string[] = [];
  @Input() fields: string[] = [];

  table: Paginator = new Paginator()
  items: any[] = []
  total: number = 0
  perPage: FormGroup = new FormGroup({
    number: new FormControl('')
  });
  search: FormGroup = new FormGroup({
    filter: new FormControl('')
  });

  lifeUrl: string = CAMERA_PATH
  constructor(
    private restApi: RestApiService
  ) {}
  ngOnInit(): void {
    this.table.path = this.path
    this.table.pathLoads = this.pathLoads
    this.perPage.get('number')?.setValue(this.table.perPages[0])
    this.table.currentPage = 1
    this.getItems()
  }

  // Evento cuando cambia el número de registros por página
  detectChange(event: any) {
    this.table.currentPage = 1
    let value = this.perPage.get('number')?.value
    if(value) {
      this.table.itemsPerPage = parseInt(value)
      if(!this.search.get('filter')?.value) {
        this.getItems()
        this.table.getTotalPages()
      } else {
        this.getItemsByFilter()
      }
    }
  }

  // Evento cuando escriben en el buscador o filtro de la tabla
  onInput(event:any) {
    this.filterData(false)
  }

  filterData(btnPress: boolean) {
    if(!btnPress) {
      this.table.currentPage = 1
    }
    if(this.search.get('filter')?.value) {
      const filter = this.search.get('filter')?.value
      if(filter !== '') {
        this.getItemsByFilter()
      }
    } else {
      this.getItems()
    }
  }

  getTotalRows() {
    this.restApi.doPost(`${this.table.path}/total`, {}).subscribe((data: any) => {
        if(!data.error) {
          if(data.result[0] === true) {
            this.table.setTotal(data.result[1].total)
          }
        }
      })
  }

  getItems() {
    const dataToSend = {
      current_page:this.table.currentPage,
      per_page: this.table.itemsPerPage
    }
    this.restApi.doPost(
      `${this.table.path}/load`,
      dataToSend
    ).subscribe((data: any) => {
      if(!data.error) {
        if(data.result[0] === true) {
          data.result[1].map((el:any, i:number) => {
            el.index = ((this.table.currentPage - 1) * this.perPage.get('number')?.value) + (i+1)
          })
          this.items = data.result[1]
          this.getTotalRows()
        }
      }
    })
  }

  getItemsByFilter() {
    // Preparamos los datos a enviar
    const dataToSend = {
      current_page:this.table.currentPage,
      per_page: this.table.itemsPerPage,
      filter: this.search.get('filter')?.value
    }
    // Hacemos la consulta y enviamos los datos
    this.restApi.doPost(
      `${this.table.path}/filter`,
      dataToSend
    ).subscribe((data: any) => {
      if(!data.error) {
        if(data.result[0] === true) {
          data.result[1].map((el:any, i:number) => {
            el.index = ((this.table.currentPage - 1) * this.perPage.get('number')?.value) + (i+1)
          })
          this.items = data.result[1]
          this.table.setTotal(data.result[2].total)
        }
      }
    })
  }

  previousPage() {
    this.table.previousPage()
    this.filterData(true)
  }

  nextPage() {
    this.table.nextPage()
    this.filterData(true)
  }

  changePage(n:number) {
    this.table.setCurrentPage(n)
    this.filterData(true)
  }
}
