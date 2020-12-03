import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';

export interface ITukenme {
  aylikTukenmeHizi?: number;
  haftalikTukenmeHizi?: number;
  raporVeriOlcekSuresi?: number;
  urunFire?: number;
  stokGunluguList?: ISatisStokHareketleri[];
}

export const defaultValue: Readonly<ITukenme> = {};
