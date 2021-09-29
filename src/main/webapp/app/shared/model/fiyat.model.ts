export interface IFiyat {
  urunId?: number;
  urunAdi?: string;
  eskiFiyat?: number;
  yeniFiyat?: number;
}

export const defaultValue: Readonly<IFiyat> = {};
