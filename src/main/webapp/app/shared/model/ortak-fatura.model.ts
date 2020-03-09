import { Moment } from 'moment';

export interface IOrtakFatura {
  tutar?: number;
  tarih?: Moment;
}

export const defaultValue: Readonly<IOrtakFatura> = {};
