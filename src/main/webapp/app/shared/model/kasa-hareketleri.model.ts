import dayjs from 'dayjs';

export interface IKasaHareketleri {
  id?: number;
  kasaMiktar?: number | null;
  hareket?: string | null;
  tarih?: string | null;
}

export const defaultValue: Readonly<IKasaHareketleri> = {};
