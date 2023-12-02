import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CAMERA_PATH, EXCEL_PATH } from 'src/app/config/constants';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Paginator } from 'src/app/utilities/paginator';

@Component({
  selector: 'app-table-common',
  templateUrl: './table-common.component.html',
  styleUrls: ['./table-common.component.css']
})
export class TableCommonComponent implements OnChanges, AfterViewInit {
  @Input() sectionName: string = '';
  @Input() path: string = '';
  @Input() pathLoads: string = '';
  @Input() theads: string[] = [];
  @Input() fields: string[] = [];
  @Input() wasUpdated: boolean = false;

  @Output() prepareFormToUpdate = new EventEmitter<any>();
  @Output() prepareFormToAdd = new EventEmitter<any>();
  @Output() prepareToDelete = new EventEmitter<any>();

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
    private restApi: RestApiService,
    private cdr: ChangeDetectorRef
  ) {}

  // Inicializamos la tabla luego de que los componente carguen
  ngAfterViewInit(): void {
    this.table.path = this.path
    this.table.pathLoads = this.pathLoads
    this.perPage.get('number')?.setValue(this.table.perPages[0])
    this.table.currentPage = 1
    this.getItems()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['wasUpdated']) {
      if(changes['wasUpdated'].currentValue) {
        if(this.search.get('filter')?.value === '') {
          this.getItems()
        } else {
          this.getItemsByFilter()
        }
      }
    }
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
          this.cdr.markForCheck()
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

  openFormToAdd() {
    this.prepareFormToAdd.emit()
  }

  openFormToUpdate(item: any) {
    const clone = {...item}
    if(clone.index) {
      delete clone.index
    }

    this.prepareFormToUpdate.emit(clone);
  }

  askToDelete(item: any) {
    this.prepareToDelete.emit(item.id)
  }

  createExcel() {
    this.restApi.getExcel(EXCEL_PATH, {
      data: [...this.getExcelData()],
      file_name: this.sectionName,
      is_filtered: this.search.get('filter')?.value !== ''
    }).subscribe((response: any) => {
        let blob: Blob = response.body
        this.restApi.dowloadFile(blob, this.getFileName(response))
      },
    );
  }

  getExcelData() {
    let clone = [...this.items]
    let data =  clone.map((item) => {
      let obj: any = {}
      // Extraemos los datos que queremos en nuestro excel
      Object.keys(item).forEach(key => {
        if(key === 'index') {
          obj[key] = item[key]
        }
        if(typeof item[key] === 'string') {
          obj[key] = item[key]
        }
      })
      //Creamos un arreglo con los datos de la fila ordenada
      let arr: (string | number)[] = []
      this.fields.forEach(key => {
        arr.push(obj[key])
      })
      return arr
    })
    let titles = [...this.theads]
    titles.pop()
    data.unshift(titles)

    return data
  }

  getFileName(response: any) {
    const contentDisposition = response.headers.get('content-disposition');
    if(contentDisposition) {
      let filename = contentDisposition.split('=')[1];
      return filename + ".xlsx"
    }
    return 'report.xlsx';
  }
}

