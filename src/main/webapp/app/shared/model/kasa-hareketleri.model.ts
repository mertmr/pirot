import { Moment } from 'moment';

export interface IKasaHareketleri {
  id?: number;
  kasaMiktar?: number;
  hareket?: string;
  tarih?: Moment;
}

export const defaultValue: Readonly<IKasaHareketleri> = {};
