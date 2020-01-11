import { Moment } from 'moment';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { IUser } from 'app/shared/model/user.model';

export interface ISatis {
  id?: number;
  tarih?: Moment;
  toplamTutar?: number;
  ortagaSatis?: boolean;
  stokHareketleriLists?: ISatisStokHareketleri[];
  user?: IUser;
}

export const defaultValue: Readonly<ISatis> = {
  stokHareketleriLists: []
};

export const defaultValueWithNew: Readonly<ISatis> = {
  stokHareketleriLists: [
    {
      miktar: 0,
      urun: {
        urunAdi: 'Ürün seçiniz',
        id: 1
      }
    }
  ]
};
