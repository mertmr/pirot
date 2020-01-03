import { IUser } from 'app/shared/model/user.model';
import { IKdvKategorisi } from 'app/shared/model/kdv-kategorisi.model';
import { Birim } from 'app/shared/model/enumerations/birim.model';
import { UrunKategorisi } from 'app/shared/model/enumerations/urun-kategorisi.model';

export interface IUrun {
  id?: number;
  urunAdi?: string;
  musteriFiyati?: number;
  birim?: Birim;
  dayanismaUrunu?: boolean;
  urunKategorisi?: UrunKategorisi;
  user?: IUser;
  kdvKategorisi?: IKdvKategorisi;
}

export const defaultValue: Readonly<IUrun> = {
  dayanismaUrunu: false
};
