import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';
import { StokHareketiTipi } from 'app/shared/model/enumerations/stok-hareketi-tipi.model';
import { defaultValue as defaultUrun } from 'app/shared/model/urun.model';

export interface IStokGirisi {
  id?: number;
  miktar?: number;
  agirlik?: number;
  notlar?: string;
  stokHareketiTipi?: StokHareketiTipi;
  tarih?: string;
  user?: IUser;
  urun?: IUrun;
}

export const defaultValue: Readonly<IStokGirisi> = {
  urun: defaultUrun,
};
