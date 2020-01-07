import { Moment } from 'moment';

export interface IKisiler {
  id?: number;
  kisiAdi?: string;
  notlar?: string;
  tarih?: Moment;
}

export const defaultValue: Readonly<IKisiler> = {};
