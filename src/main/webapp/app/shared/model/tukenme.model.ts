import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';

export interface ITukenme {
  aylikTukenmeHizi?: number;
  haftalikTukenmeHizi?: number;
  raporVeriOlcekSuresi?: number;
  stokGunluguList?: ISatisStokHareketleri[];
}

export const defaultValue: Readonly<ITukenme> = {};
