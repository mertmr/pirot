import { IFiyat } from 'app/shared/model/fiyat.model';

export interface IFiyatDTO {
  fiyatHesapDTOList?: Array<IFiyat>;
}

export const defaultValue: IFiyatDTO = {};
