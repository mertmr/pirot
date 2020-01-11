export interface IKdvKategorisi {
  id?: number;
  kategoriAdi?: string;
  kdvOrani?: number;
}

export const defaultValue: Readonly<IKdvKategorisi> = {};
export const defaultValueList: Array<IKdvKategorisi> = [];
