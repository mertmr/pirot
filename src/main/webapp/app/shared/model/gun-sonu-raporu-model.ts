import { IDashboardReports } from 'app/shared/model/dashboard-reports.model';
import { IVirman } from 'app/shared/model/virman.model';
import { IGider } from 'app/shared/model/gider.model';
import { INobetHareketleri } from 'app/shared/model/nobet-hareketleri.model';

export interface IGunSonuRaporu {
  dashboardReports?: IDashboardReports;
  virman?: IVirman;
  giderList?: IGider[];
  nobetHareketleri?: INobetHareketleri;
}

export const defaultValueGunSonuRaporu: Readonly<IGunSonuRaporu> = {};
