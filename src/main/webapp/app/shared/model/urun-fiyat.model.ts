import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';

export interface IUrunFiyat {
  id?: number;
  fiyat?: number | null;
  tarih?: string | null;
  user?: IUser | null;
  urun?: IUrun | null;
}

export const defaultValue: Readonly<IUrunFiyat> = {};
