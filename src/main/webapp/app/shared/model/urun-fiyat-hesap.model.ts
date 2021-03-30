import { IUrun } from 'app/shared/model/urun.model';

export interface IUrunFiyatHesap {
  id?: number;
  amortisman?: number | null;
  giderPusulaMustahsil?: number | null;
  dukkanGider?: number | null;
  kooperatifCalisma?: number | null;
  dayanisma?: number | null;
  fire?: number | null;
  urun?: IUrun | null;
}

export const defaultValue: Readonly<IUrunFiyatHesap> = {};
