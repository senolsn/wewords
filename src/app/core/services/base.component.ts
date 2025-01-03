import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrUpdate } from '../models/enums/CreateOrUpdate';
import { NotificationService } from './notification.service';
import { DxColumn } from '../components/base-data-grid/base-data-grid.model';
import CustomStore from 'devextreme/data/custom_store';
import { LanguageService } from './language.service';

@Injectable()
export abstract class BaseComponent<T> {

  constructor(protected notificationService: NotificationService, protected languageService: LanguageService, form: string) {}

  data$: Observable<any>;
  dataSource: Array<T>;
  customStore: CustomStore;
  columns: Array<DxColumn> = new Array<DxColumn>;
  selectedItem: T;
  model: T;
  title: string;
  silmeYetkisi: boolean = false;
  degistirmeYetkisi: boolean = false;
  yazmaYetkisi: boolean = false;
  createOrUpdate: CreateOrUpdate = CreateOrUpdate.create;
  form: string;

  abstract getDataObservable(): Observable<T[]>;
  abstract fillCustomStore(): void;
  abstract openAddModal(): void;
  abstract openUpdateModal(): void;
  abstract saveData(data: T): void;
  abstract remove(): Promise<void>;

  addModal = (title: string): void => {
    this.createOrUpdate = CreateOrUpdate.create;
    this.languageService.translate(title).subscribe(data => this.title = data);
  }

  updateModal = (title: string): void => {
    this.model = this.selectedItem;
    this.createOrUpdate = CreateOrUpdate.update;
    this.languageService.translate(title).subscribe(data => this.title = data);
  }

  onCellClick = (item: T) => this.selectedItem = item;

  showToastr = (message: string) => this.notificationService.success(message);

  fillDataSource = (): void => {
    this.getDataObservable().subscribe((data: any) => {
      this.dataSource = data;
    });
  }
}
