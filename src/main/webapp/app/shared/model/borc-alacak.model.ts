import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';
import { OdemeAraci } from 'app/shared/model/enumerations/odeme-araci.model';
import { HareketTipi } from 'app/shared/model/enumerations/hareket-tipi.model';

export interface IBorcAlacak {
  id?: number;
  tutar?: number | null;
  notlar?: string | null;
  odemeAraci?: OdemeAraci | null;
  hareketTipi?: HareketTipi | null;
  tarih?: string | null;
  user?: IUser | null;
  urun?: IUrun | null;
}

export const defaultValue: Readonly<IBorcAlacak> = {};
