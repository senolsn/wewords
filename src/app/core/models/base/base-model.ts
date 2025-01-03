export abstract class BaseModel {

  public id: number = 0;
  public active: boolean = true;

  public CreatedById: number;
  public CreatedAt: Date;

  public UpdatedById: number;
  public UpdatedAt: Date;

  public DeletedById: number;
  public DeletedAt: Date;

  public static convertToModel(model: BaseModel, obj: any) {
    model.id = obj.refKey;
    model.active = obj.aktif;


    model.UpdatedById = obj.GuncellemeYapanKullanici;
    model.UpdatedAt = Date.parseFromJson(obj.GuncellemeZamani);

    model.DeletedById = obj.PasifYpanKullanici;
    model.DeletedAt = Date.parseFromJson(obj.PasifZamani)
  }

  constructor(init?: Partial<BaseModel>) {
    Object.assign(this, init)
  }

  public convertToDeleteBackendModel(): any {
    return {
      RefKey: this.id,
      Aktif: false
    };
  }


  public static equal(m1: BaseModel, m2: BaseModel) {
    const m1IsNullOrUndefined: boolean = m1 ? false : true;
    const m2IsNullOrUndefined: boolean = m2 ? false : true;

    if (m1IsNullOrUndefined && m2IsNullOrUndefined)
      return true;

    if (m1IsNullOrUndefined && !m2IsNullOrUndefined)
      return false;

    if (!m1IsNullOrUndefined && m2IsNullOrUndefined)
      return false;

    return (m1.id === m2.id);
  }

  public static getIdAsStringIfExists(m: BaseModel) {
    if (!m)
      return '';

    return m.id.toString();
  }

}
