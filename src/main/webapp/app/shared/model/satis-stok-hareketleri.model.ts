import { IUrun } from 'app/shared/model/urun.model';
import { ISatis } from 'app/shared/model/satis.model';

export interface ISatisStokHareketleri {
  id?: number;
  miktar?: number;
  tutar?: number;
  urun?: IUrun;
  satis?: ISatis;
}

export const defaultValue: Readonly<ISatisStokHareketleri> = {};
