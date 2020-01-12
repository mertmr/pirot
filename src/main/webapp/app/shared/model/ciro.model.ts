import { Moment } from 'moment';

export interface ICiro {
  tutar?: number;
  tarih?: Moment;
}

export const defaultValue: Readonly<ICiro> = {};
