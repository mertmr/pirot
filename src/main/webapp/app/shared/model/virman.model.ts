import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { Hesap } from 'app/shared/model/enumerations/hesap.model';

export interface IVirman {
  id?: number;
  tutar?: number;
  notlar?: string;
  cikisHesabi?: Hesap | null;
  girisHesabi?: Hesap | null;
  tarih?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IVirman> = {};
