import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { AcilisKapanis } from 'app/shared/model/enumerations/acilis-kapanis.model';

export interface INobetHareketleri {
  id?: number;
  kasa?: number;
  pirot?: number;
  fark?: number;
  nobetSuresi?: number;
  notlar?: string;
  acilisKapanis?: AcilisKapanis;
  tarih?: string;
  user?: IUser;
}

export const defaultValue: Readonly<INobetHareketleri> = {};
