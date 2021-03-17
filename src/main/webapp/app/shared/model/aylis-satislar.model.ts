import { Moment } from 'moment';

export interface IAylikSatislar {
  year?: number;
  month?: number;
  miktar?: number;
}

export const defaultValue: Readonly<IAylikSatislar> = {};
