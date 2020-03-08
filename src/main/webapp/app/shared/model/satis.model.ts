import { Moment } from 'moment';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { IUser } from 'app/shared/model/user.model';
import { IKisiler } from 'app/shared/model/kisiler.model';

export interface ISatis {
  id?: number;
  tarih?: Moment;
  toplamTutar?: number;
  ortagaSatis?: boolean;
  kartliSatis?: boolean;
  stokHareketleriLists?: ISatisStokHareketleri[];
  user?: IUser;
  kisi?: IKisiler;
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
