export enum ContextMenuOperationType {
  Update = 1,
  Delete = 2,
}

export class ContextMenuClickEventArgs {
  public operation: ContextMenuOperationType;
  public item: any;

  constructor(op: ContextMenuOperationType, item: any) {
    this.operation = op;
    this.item = item;
  }
}
