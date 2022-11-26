export interface IDashboardReports {
  kasadaNeVar?: number;
  bankadaNeVar?: number;
  gunlukCiro?: number;
  kartliSatis?: number;
  nakitSatis?: number;
  toplamBorc?: number;
  haftalikCiroRakamlari?: [];
  haftalikCiroTarihleri?: [];
}

export const defaultValue: Readonly<IDashboardReports> = {};
