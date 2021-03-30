import dayjs from 'dayjs';

export interface IKisiler {
  id?: number;
  kisiAdi?: string | null;
  notlar?: string | null;
  tarih?: string | null;
  active?: boolean | null;
}

export const defaultValue: Readonly<IKisiler> = {
  active: false,
};
