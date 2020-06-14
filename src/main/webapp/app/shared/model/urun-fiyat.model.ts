import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';

export interface IUrunFiyat {
  id?: number;
  fiyat?: number;
  tarih?: string;
  user?: IUser;
  urun?: IUrun;
}

export const defaultValue: Readonly<IUrunFiyat> = {};
