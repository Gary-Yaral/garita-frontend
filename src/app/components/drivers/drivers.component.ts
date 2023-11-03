import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CAMERA_PATH } from 'src/app/config/constants';
import { Driver } from 'src/app/interfaces/allTypes';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Paginator } from 'src/app/utilities/paginator';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
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
    this.table.path = 'http://localhost:4000/driver'
    this.table.pathLoads = '/loads'
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
