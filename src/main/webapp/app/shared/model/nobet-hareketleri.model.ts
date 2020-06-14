import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface INobetHareketleri {
  id?: number;
  kasa?: number;
  pirot?: number;
  fark?: number;
  nobetSuresi?: number;
  notlar?: string;
  tarih?: string;
  user?: IUser;
}

export const defaultValue: Readonly<INobetHareketleri> = {};
