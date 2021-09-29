import { IUrun } from 'app/shared/model/urun.model';
import { FATURA_TIPI } from 'app/shared/model/enumerations/fatura-tipi.model';

export interface IUrunFiyatHesap {
  id?: number;
  faturaTipi?: FATURA_TIPI;
  amortisman?: number;
  giderPusulaMustahsil?: number;
  dukkanGider?: number;
  kooperatifCalisma?: number;
  dayanisma?: number;
  fire?: number;
  urun?: IUrun;
}

export const defaultValue: Readonly<IUrunFiyatHesap> = {};
