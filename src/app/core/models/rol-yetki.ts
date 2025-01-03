
export class RolYetki {

    public rolRefKey: string;
    public modulRefKey: number;
    public formRefKey: null | number;
    public okuma: boolean = false;
    public yazma: boolean = false;
    public degistirme: boolean = false;
    public silme: boolean = false;

    //for grid view
    public rolAdi: string;
    public modulAdi: string;
    public formAdi: string;
}