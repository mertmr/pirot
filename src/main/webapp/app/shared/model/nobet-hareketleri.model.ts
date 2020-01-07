import { Moment } from 'moment';

export interface INobetHareketleri {
  id?: number;
  kasa?: number;
  pirot?: number;
  fark?: number;
  notlar?: string;
  tarih?: Moment;
}

export const defaultValue: Readonly<INobetHareketleri> = {};
