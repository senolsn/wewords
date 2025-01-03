import { BaseDataGridService } from './base-data-grid.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DxDataGridComponent, DxToolbarComponent, DxLoadIndicatorModule } from "devextreme-angular";
import { DxColumn } from "./base-data-grid.model";

@Component({
  selector: "app-base-data-grid",
  templateUrl: "./base-data-grid.component.html",
  styleUrls: ["./base-data-grid.component.scss"],
})
export class BaseDataGridComponent implements OnInit, OnChanges {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @Input() public isClearFilter: boolean = true; //=> filtreleme yapıp, soldan farklı seçim yapıp listeleme yapıldığında yazılan filtre kaybolur/ false= kaybolmaz.

  public _dataSource: any;
  @Input() public set dataSource(dataSource: any) {
    this._dataSource = dataSource;
    this.dataGrid?.instance.pageIndex(0);
    // this.dataGrid?.instance.clearFilter();
    this.isClearFilter ? this.dataGrid?.instance.clearFilter() : null;
    this.dataGrid?.instance.clearGrouping();
    this.dataGrid?.instance.clearSelection();
    this.dataGrid?.instance.clearSorting();
    this.dataGrid?.instance.repaint();
  }

  @Input() public columns: Array<DxColumn>;
  @Input() public selectedItem: any;
  @Input() public serverSide: boolean = false;
  @Input() public filtering: boolean = true;
  @Input() public stateStoringKey: string;
  @Input() public stateStoring: boolean = false;

  public _addButton: boolean = true;
  public _updateButton: boolean = true;
  public _deleteButton: boolean = true;

  @Input() public set addButton(value: any) {
    this._addButton = value;
    this.dataGrid?.instance.repaint();
  }

  @Input() public set updateButton(value: any) {
    this._updateButton = value;
    this.dataGrid?.instance.repaint();
  }

  @Input() public set deleteButton(value: any) {
    this._deleteButton = value;
    this.dataGrid?.instance.repaint();
  }


  @Input() public refreshButton: boolean = true;
  @Input() public columnButton: boolean = true;
  @Input() public simple: boolean = false;
  @Input() public isPaging: boolean = false;
  @Input() public pageSize: any = "25";
  @Input() public grouping: boolean = true;
  @Input() public formName: string = "";
  @Input() public selectedRowClick: Array<any> = [];
  @Input() public selectedRowKeys: Array<any> = [];
  @Input() public kriterlerGenisletButton: boolean = false;
  @Input() public export: boolean = true;
  public filter: boolean = true;
  filterClasses: any = {
    filterClass: "col-12 col-sm-6 col-md-4 col-lg-3 pt-2",
    gridClass: "col-12 col-sm-6 col-md-8 col-lg-9 mt-2",
  };
  @Output() public classChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() public rowClass: (args: any) => void = function (e) { };
  @Input() public searchPanel: boolean = false;

  @Input() public loadPanel: boolean = true;
  public lang: string;
  @Output() public addModalOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public updateModalOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public deleteModalOpened: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public refreshButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() public selectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() public columnsOptions: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public selectedRowOutput: EventEmitter<any> = new EventEmitter<any>();

  public get summaryColumns() {
    return this.columns.filter((x) => x.summary === true);
  }

  public get groupSummaryColumns() {
    return this.columns.filter((x) => x.summaryGroup === true);
  }

  constructor(private readonly baseDataGridService: BaseDataGridService) { }
  public indicatorUrl: string;
  ngOnInit(): void {
    this.baseDataGridService.refresh.subscribe(() => this.refreshDataGrid());
    if (this.kriterlerGenisletButton) {
      this.classChanged.emit(this.filterClasses);
    }
    this.indicatorUrl = "https://js.devexpress.com/Content/data/loadingIcons/rolling.svg";
  }

  async ngOnChanges() {
  }

  onCellPrepared(e: any) {
    if (e.rowType == "header") {
      e.cellElement.style.fontWeight = "bold";
    }

    if (e.rowType == "data") {
      this.rowClass(e);
    }
  }

  onToolbarPreparing(e: any) {
    if (!this.simple)
      e.toolbarOptions.items.unshift(
        {
          location: "before",
          widget: "dxButton",
          options: {
            icon: "chevrondoubleleft",
            onClick: this.toogleFilterSide,
            visible: this.kriterlerGenisletButton,
            hint: "Genişlet",
          },
        },
        {
          location: "before",
          widget: "dxButton",
          options: {
            type: "success",
            icon: "plus",
            onClick: this.openAddModal,
            hint: "Ekle",
            visible: this._addButton,
          },
        },
        {
          location: "before",
          widget: "dxButton",
          options: {
            type: "default",
            icon: "edit",
            onClick: this.openUpdateModal,
            hint: "Güncelleme",
            disabled: !this.secildi,
            visible: this._updateButton,
          },
        },
        {
          location: "before",
          widget: "dxButton",
          options: {
            type: "danger",
            icon: "remove",
            onClick: this.openDeleteModal,
            disabled: !this.secildi,
            hint: "Sil",
            visible: this._deleteButton,
          },
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "refresh",
            type: "default",
            onClick: this.refreshDataGrid,
            visible: this.refreshButton,
            class: "btn-large",
            hint: "Yenile",
          },
        },
        {
          location: "after",
          widget: "dxButton",
          options: {
            icon: "check",
            text: "Kaydet",
            onClick: this.gorunumuKaydet,
            visible: false,
          },
        }
      );
  }

  public async onSelectionChanged(e: any): Promise<any> {
    //this.dataGrid.instance.pageIndex(0);
    this.selectedItem = await this.dataGrid.instance.getSelectedRowsData()[0];
    this.selectionChange.emit(this.selectedItem);

    e.component.repaint();
  }

  public get secildi(): boolean {
    return !!this.selectedItem;
  }

  public openAddModal = () => {
    this.addModalOpened.emit();
  };

  public openUpdateModal = () => {
    this.updateModalOpened.emit();
  };

  public openDeleteModal = () => {
    this.deleteModalOpened.emit();
  };

  refreshDataGrid = () => {
    this.refreshButtonClicked.emit();
    this.dataGrid.instance.refresh();
    this.dataGrid.instance.repaint();
  };

  gorunumuKaydet = () => {
    this.dataGrid.instance.repaint();
    let cols = this.dataGrid.instance.option("columns");
    let info = [];

    for (var i = 0; i < cols.length; i++) {
      info.push(this.dataGrid.instance.columnOption((cols[i] as any).dataField));
    }

    this.columnsOptions.emit(info);
  };

  toogleFilterSide = (e: any) => {
    this.filter = !this.filter;
    e.component.option({
      icon: this.filter === true ? "chevrondoubleleft" : "chevrondoubleright",
      hint: "Kriterler",
    });

    if (!this.filter) {
      this.filterClasses.filterClass = "d-none";
      this.filterClasses.gridClass =
        "col-12 col-sm-12 col-md-12 col-lg-12 mt-2";
      this.classChanged.emit(this.filterClasses);
    } else {
      this.filterClasses.filterClass = "col-12 col-sm-6 col-md-4 col-lg-3 pt-2";
      this.filterClasses.gridClass = "col-12 col-sm-6 col-md-8 col-lg-9 mt-2";
      this.classChanged.emit(this.filterClasses);
    }
  };

  onRowPrepared(e: any) {
    if (e.rowType == "data") this.rowClass(e);
  }
  onContentReady(e: any) {
    if (true) {
      let scroll = e.component.getScrollable();
      scroll?.option("scrollByContent", true);
      scroll?.option("scrollByThumb", true);
    }
  }
  onRowDblClick(){
    this.updateModalOpened.emit();
  }
}
