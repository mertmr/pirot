export interface IAylikSatislarMali {
  aylikSatisMap?: Map<string, number>;
  tarihListesi?: Array<string>;
  urunAdiListesi?: Array<string>;
}

export const defaultValue: Readonly<IAylikSatislarMali> = {};
