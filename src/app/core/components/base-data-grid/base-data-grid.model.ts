type ColumnType =
  | "string"
  | "number"
  | "boolean"
  | "datetime"
  | "date"
  | "command"
  | "buttons";

interface IDxColumn {
  caption?: string;
  field?: string;
  visible?: boolean;
  type?: ColumnType;
  format?: string;
  hint?: string;
  icon?: string;
  cssClass?: string;
  buttonText?: string;
  alignment?: string;
  buttonCallBack?: (args: any) => void;
  summary?: boolean;
  summaryType?: string;
  showInGroupFooter?: boolean;
  summaryGroup?: boolean;
  groupIndex?: string;
  fixed?: boolean;
  title?: string;
}

export class DxColumn {
  public caption: string;
  public field: string;
  public visible: boolean;
  public type: ColumnType;
  public format: string;
  public hint: string;
  public icon: string;
  public cssClass: string;
  public buttonText: string;
  public buttonCallBack: (args: any) => void;
  public summary: boolean;
  public summaryType: string;
  public showInGroupFooter: boolean;
  public summaryGroup: boolean;
  public fixed: boolean;
  public title: string;
  public groupIndex:string;

  constructor({
    caption = "",
    field = "",
    visible = true,
    type = "string",
    format = "",
    hint = "",
    icon = "",
    cssClass = "",
    buttonText = "",
    alignment = "",
    buttonCallBack = () => { },
    summary = false,
    summaryType = "sum",
    summaryGroup = false,
    showInGroupFooter = false,
    fixed = false,
    title = "",
    groupIndex = ""
  }: IDxColumn) {
    this.caption = caption;
    this.field = field;
    this.type = type;
    this.visible = visible;
    this.hint = hint;
    this.groupIndex = groupIndex;
    this.icon = icon;
    this.cssClass = cssClass;
    this.buttonText = buttonText;
    this.summaryGroup = summaryGroup;
    this.showInGroupFooter = showInGroupFooter;
    this.fixed = fixed;
    this.title = title;
    if (this.isColumnDate && !this.format) this.format = "dd-MM-yyyy HH:mm:ss";
    else this.format = format;
    (this.buttonCallBack = buttonCallBack),
      (this.summary = summary),
      (this.summaryType = summaryType);
  }

  public get isColumnBoolean(): boolean {
    return this.type === "boolean";
  }

  public get isColumnDate(): boolean {
    return this.type === "datetime";
  }

  public get isButtonColumn(): boolean {
    return this.type === "command";
  }

  public get filter(): string {
    if (this.type === "number") {
      return "numeric";
    }
    if (this.type === "boolean") {
      return "boolean";
    }
    if (this.type === "datetime") {
      return "date";
    }
    return "";
  }
}
