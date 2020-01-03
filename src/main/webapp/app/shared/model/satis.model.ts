import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface ISatis {
  id?: number;
  tarih?: Moment;
  user?: IUser;
}

export const defaultValue: Readonly<ISatis> = {};
