import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IUretici {
  id?: number;
  adi?: string;
  adres?: string | null;
  bankaBilgileri?: string;
  tarih?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IUretici> = {};
