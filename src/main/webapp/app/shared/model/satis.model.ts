import { Moment } from 'moment';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { IUser } from 'app/shared/model/user.model';

export interface ISatis {
  id?: number;
  tarih?: Moment;
  toplamTutar?: number;
  ortagaSatis?: boolean;
  kartliSatis?: boolean;
  stokHareketleriLists?: ISatisStokHareketleri[];
  user?: IUser;
}

export const defaultValue: Readonly<ISatis> = {
  ortagaSatis: false,
  kartliSatis: false
};
