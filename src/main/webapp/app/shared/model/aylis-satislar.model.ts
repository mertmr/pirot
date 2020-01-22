import { Moment } from 'moment';

export interface IAylikSatislar {
  aylikSatisMap?: Map<string, number>;
  tarihListesi?: Array<string>;
  urunAdiListesi?: Array<string>;
}

export const defaultValue: Readonly<IAylikSatislar> = {};
