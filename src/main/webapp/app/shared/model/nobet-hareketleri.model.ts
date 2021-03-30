import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { AcilisKapanis } from 'app/shared/model/enumerations/acilis-kapanis.model';

export interface INobetHareketleri {
  id?: number;
  kasa?: number | null;
  pirot?: number | null;
  fark?: number | null;
  farkDenge?: number | null;
  nobetSuresi?: number | null;
  notlar?: string | null;
  acilisKapanis?: AcilisKapanis | null;
  tarih?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<INobetHareketleri> = {};
