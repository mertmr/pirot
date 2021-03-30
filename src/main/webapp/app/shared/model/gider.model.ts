import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { GiderTipi } from 'app/shared/model/enumerations/gider-tipi.model';
import { OdemeAraci } from 'app/shared/model/enumerations/odeme-araci.model';

export interface IGider {
  id?: number;
  tarih?: string | null;
  tutar?: number;
  notlar?: string;
  giderTipi?: GiderTipi;
  odemeAraci?: OdemeAraci;
  user?: IUser | null;
}

export const defaultValue: Readonly<IGider> = {};
