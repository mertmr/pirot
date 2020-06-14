import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';
import { OdemeAraci } from 'app/shared/model/enumerations/odeme-araci.model';
import { HareketTipi } from 'app/shared/model/enumerations/hareket-tipi.model';

export interface IBorcAlacak {
  id?: number;
  tutar?: number;
  notlar?: string;
  odemeAraci?: OdemeAraci;
  hareketTipi?: HareketTipi;
  tarih?: string;
  user?: IUser;
  urun?: IUrun;
}

export const defaultValue: Readonly<IBorcAlacak> = {};
