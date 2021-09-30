import { IUser } from 'app/shared/model/user.model';
import { IKdvKategorisi } from 'app/shared/model/kdv-kategorisi.model';
import { IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { Birim } from 'app/shared/model/enumerations/birim.model';
import { UrunKategorisi } from 'app/shared/model/enumerations/urun-kategorisi.model';

export interface IUrun {
  id?: number;
  urunAdi?: string;
  stok?: number;
  stokSiniri?: number;
  musteriFiyati?: number;
  birim?: Birim;
  dayanismaUrunu?: boolean;
  satista?: boolean;
  urunKategorisi?: UrunKategorisi;
  urunSorumlusu?: IUser;
  kdvKategorisi?: IKdvKategorisi;
  urunFiyatHesap?: IUrunFiyatHesap;
  active?: boolean;
}

export const defaultValue: Readonly<IUrun> = {
  dayanismaUrunu: false,
  satista: false,
};
