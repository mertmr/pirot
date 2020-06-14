import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { Hesap } from 'app/shared/model/enumerations/hesap.model';

export interface IVirman {
  id?: number;
  tutar?: number;
  notlar?: string;
  cikisHesabi?: Hesap;
  girisHesabi?: Hesap;
  tarih?: string;
  user?: IUser;
}

export const defaultValue: Readonly<IVirman> = {};
