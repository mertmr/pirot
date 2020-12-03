import { Moment } from 'moment';

export interface IStokGirisiUrun {
  stokGirisiId?: number;
  miktar?: number;
  stokGirisiTarihi?: Moment;
  stokGirisAciklamasi?: string;
}

export const defaultValueStokGirisiUrun: Readonly<IStokGirisiUrun> = {};
