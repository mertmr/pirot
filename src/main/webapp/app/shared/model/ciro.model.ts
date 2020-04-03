import { Moment } from 'moment';

export interface ICiro {
  tutar?: number;
  kartli?: number;
  nakit?: number;
  tarih?: Moment;
}

export const defaultValue: Readonly<ICiro> = {};
