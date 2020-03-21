export interface IOrtakFaturaDetay {
  urunAdiKdv?: string;
  miktar?: string;
  birimFiyat?: number;
  toplamTutar?: number;
}

export const defaultValue: Readonly<IOrtakFaturaDetay> = {};
