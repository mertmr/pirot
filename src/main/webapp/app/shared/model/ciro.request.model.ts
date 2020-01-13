import { Moment } from 'moment';

export interface ICiroRequest {
  to?: Moment;
  from?: Moment;
}

export const defaultValue: Readonly<ICiroRequest> = {};
