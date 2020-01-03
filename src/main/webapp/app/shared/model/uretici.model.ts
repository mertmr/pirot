import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IUretici {
  id?: number;
  adi?: string;
  adres?: string;
  bankaBilgileri?: string;
  tarih?: Moment;
  user?: IUser;
}

export const defaultValue: Readonly<IUretici> = {};
