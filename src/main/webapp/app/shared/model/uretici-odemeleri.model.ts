import { Moment } from 'moment';
import { IUretici } from 'app/shared/model/uretici.model';

export interface IUreticiOdemeleri {
  id?: number;
  tutar?: number;
  sonGuncellenmeTarihi?: string;
  uretici?: IUretici;
}

export const defaultValue: Readonly<IUreticiOdemeleri> = {};
