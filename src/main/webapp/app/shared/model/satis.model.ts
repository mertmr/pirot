import { Moment } from 'moment';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { IUser } from 'app/shared/model/user.model';
import { IUrun } from 'app/shared/model/urun.model';

export interface ISatis {
  id?: number;
  tarih?: Moment;
  toplamTutar?: number;
  stokHareketleriLists?: ISatisStokHareketleri[];
  user?: IUser;
}

export const defaultValue: Readonly<ISatis> = {
  stokHareketleriLists: [
    {
      miktar: 0,
      urun: {
        musteriFiyati: 0
      }
    }
  ]
};
