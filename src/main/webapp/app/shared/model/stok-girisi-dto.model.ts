import { StokHareketiTipi } from 'app/shared/model/enumerations/stok-hareketi-tipi.model';

export interface IStokGirisiDto {
  id?: number;
  miktar?: number;
  agirlik?: number;
  notlar?: string;
  stokHareketiTipi?: StokHareketiTipi;
  tarih?: string;
  user?: string;
  urunAdi?: string;
}

export const defaultValue: Readonly<IStokGirisiDto> = {};
