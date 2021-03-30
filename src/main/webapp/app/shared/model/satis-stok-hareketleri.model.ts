import { IUrun } from 'app/shared/model/urun.model';
import { ISatis } from 'app/shared/model/satis.model';

export interface ISatisStokHareketleri {
  id?: number;
  miktar?: number;
  tutar?: number;
  urun?: IUrun | null;
  satis?: ISatis | null;
}

export const defaultValue: Readonly<ISatisStokHareketleri> = {};
