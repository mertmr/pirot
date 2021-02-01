import { ExportSheet } from 'react-xlsx-sheet';

export default class Exportsheetcustom extends ExportSheet {
  static defaultProps: {
    dataType: string;
    header: any[];
    headerOption: {
      skipHeader: boolean;
      dateNF: string;
    };
    dataSource: any[];
    extName: string;
    isRequiredNameDate: boolean;
    fileName: string;
    xlsx: {};
    fileDate: string;
    tableElement?: HTMLTableElement;
  };
}
