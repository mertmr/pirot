import { Moment } from 'moment';

export interface IStokGirisiUrun {
  stokGirisiId?: number;
  stokGirisiTarihi?: Moment;
  stokGirisAciklamasi?: string;
}

export const defaultValue: Readonly<IStokGirisiUrun> = {};
