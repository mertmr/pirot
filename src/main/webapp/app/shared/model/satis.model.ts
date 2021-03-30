import dayjs from 'dayjs';
import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { IUser } from 'app/shared/model/user.model';
import { IKisiler } from 'app/shared/model/kisiler.model';

export interface ISatis {
  id?: number;
  tarih?: string | null;
  toplamTutar?: number | null;
  ortagaSatis?: boolean | null;
  kartliSatis?: boolean | null;
  stokHareketleriLists?: ISatisStokHareketleri[] | null;
  user?: IUser | null;
  kisi?: IKisiler | null;
}

export const defaultValue: Readonly<ISatis> = {
  stokHareketleriLists: [],
};

export const defaultValueWithNew: Readonly<ISatis> = {
  stokHareketleriLists: [
    {
      miktar: 0,
      urun: {
        urunAdi: 'Ürün seçiniz',
        id: 1,
      },
    },
  ],
};
