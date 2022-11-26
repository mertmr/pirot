export interface IFiyat {
  urunId?: number;
  urunAdi?: string;
  eskiFiyat?: number;
  yeniFiyat?: number;
  miktar?: number;
  tutar?: number;
}

export const defaultValue: IFiyat = {};
export const defaultValueList: Array<IFiyat> = [];
