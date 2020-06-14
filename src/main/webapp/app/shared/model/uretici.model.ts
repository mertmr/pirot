import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IUretici {
  id?: number;
  adi?: string;
  adres?: string;
  bankaBilgileri?: string;
  tarih?: string;
  user?: IUser;
}

export const defaultValue: Readonly<IUretici> = {};
