import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { GiderTipi } from 'app/shared/model/enumerations/gider-tipi.model';
import { OdemeAraci } from 'app/shared/model/enumerations/odeme-araci.model';

export interface IGider {
  id?: number;
  tarih?: string;
  tutar?: number;
  notlar?: string;
  giderTipi?: GiderTipi;
  odemeAraci?: OdemeAraci;
  user?: IUser;
}

export const defaultValue: Readonly<IGider> = {};
