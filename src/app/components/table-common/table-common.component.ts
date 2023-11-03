import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CAMERA_PATH } from 'src/app/config/constants';
import { Driver } from 'src/app/interfaces/allTypes';
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

  perPage: FormGroup = new FormGroup({
    number: new FormControl('')
  });

  table: Paginator = new Paginator()
  items: Driver[] = []
  theads: String[] = ['N°', 'Cédula', 'Apellidos', 'Nombres', 'Tipo', ' Opciones']


  lifeUrl: string = CAMERA_PATH
  constructor(
    private restApi: RestApiService
  ) {}
  ngOnInit(): void {
    this.table.path = this.path
    this.table.pathLoads = this.pathLoads
    this.getItems()
    this.perPage.get('number')?.setValue(this.table.perPages[0])
    this.getTotalRows()
  }

  detectChange(event: any) {
    this.table.currentPage = 1
    let value = this.perPage.get('number')?.value
    if(value) {
      this.table.itemsPerPage = parseInt(value)
      this.getItems()
      this.table.getTotalPages()
    }
  }

  getTotalRows() {
    this.restApi.doPost(`${this.table.path}/total`, {}).subscribe((data: any) => {
        if(!data.error) {
          if(data.drivers[0] === true) {
            this.table.setTotal(data.drivers[1].total)
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
        if(data.drivers[0] === true) {
            this.items = data.drivers[1]
        }
      }
    })
  }

  previousPage() {
    this.table.previousPage()
    this.getItems()
  }

  nextPage() {
    this.table.nextPage()
    this.getItems()
  }

  changePage(n:number) {
    this.table.setCurrentPage(n)
    this.getItems()
  }
}
