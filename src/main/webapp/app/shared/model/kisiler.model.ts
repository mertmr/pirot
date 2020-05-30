import { Moment } from 'moment';

export interface IKisiler {
  id?: number;
  kisiAdi?: string;
  notlar?: string;
  tarih?: Moment;
  active?: boolean;
}

export const defaultValue: Readonly<IKisiler> = {
  active: false
};
