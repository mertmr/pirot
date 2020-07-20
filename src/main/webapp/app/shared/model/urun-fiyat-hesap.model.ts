import { IUrun } from 'app/shared/model/urun.model';

export interface IUrunFiyatHesap {
  id?: number;
  amortisman?: number;
  giderPusulaMustahsil?: number;
  dukkanGider?: number;
  kooperatifCalisma?: number;
  dayanisma?: number;
  fire?: number;
  urun?: IUrun;
}

export const defaultValue: Readonly<IUrunFiyatHesap> = {};
