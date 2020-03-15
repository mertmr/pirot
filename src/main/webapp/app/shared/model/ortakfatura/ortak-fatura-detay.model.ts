import { Moment } from 'moment';

export interface IOrtakFaturaDetay {
  tutar?: number;
  tarih?: Moment;
}

export const defaultValue: Readonly<IOrtakFaturaDetay> = {};
