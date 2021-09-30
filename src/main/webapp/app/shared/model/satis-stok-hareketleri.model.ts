import { IUrun } from 'app/shared/model/urun.model';
import { ISatis } from 'app/shared/model/satis.model';
import { FATURA_TIPI } from 'app/shared/model/enumerations/fatura-tipi.model';

export interface ISatisStokHareketleri {
  id?: number;
  miktar?: number;
  tutar?: number;
  agirlikAta?: number;
  urun?: IUrun;
  satis?: ISatis;
}

export const defaultValue: Readonly<ISatisStokHareketleri> = {};
