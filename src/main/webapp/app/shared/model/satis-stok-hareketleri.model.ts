import { ISatis } from 'app/shared/model/satis.model';
import { IUrun } from 'app/shared/model/urun.model';

export interface ISatisStokHareketleri {
  id?: number;
  miktar?: number;
  tutar?: number;
  satis?: ISatis;
  urun?: IUrun;
}

export const defaultValue: Readonly<ISatisStokHareketleri> = {};
