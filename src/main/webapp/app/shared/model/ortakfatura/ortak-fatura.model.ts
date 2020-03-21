import { IOrtakFaturaDetay } from 'app/shared/model/ortakfatura/ortak-fatura-detay.model';
import { IKdvToplam } from 'app/shared/model/ortakfatura/kdv-toplam.model';

export interface IOrtakFatura {
  tumKdvToplami?: number;
  tumToplamKdvHaric?: number;
  tumToplam?: number;
  ortakFaturasiDetayDto?: ReadonlyArray<IOrtakFaturaDetay>;
  kdvToplamList?: ReadonlyArray<IKdvToplam>;
}

export const defaultValue: Readonly<IOrtakFatura> = {};
