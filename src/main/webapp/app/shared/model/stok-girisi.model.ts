import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';
import { StokHareketiTipi } from 'app/shared/model/enumerations/stok-hareketi-tipi.model';
import { defaultValue as defaultUrun } from 'app/shared/model/urun.model';

export interface IStokGirisi {
  id?: number;
  miktar?: number;
  agirlik?: number | null;
  notlar?: string;
  stokHareketiTipi?: StokHareketiTipi;
  tarih?: string | null;
  user?: IUser | null;
  urun?: IUrun | null;
}

export const defaultValue: Readonly<IStokGirisi> = {
  urun: defaultUrun,
};
