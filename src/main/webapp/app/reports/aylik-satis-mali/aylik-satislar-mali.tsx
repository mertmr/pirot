import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getAylikSatisMalilars } from './aylik-satislar-mali.reducer';

export interface IAylikSatisMalilarsPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

const previousMonth = (): string => {
  const now: Date = new Date();
  const fromDate =
    now.getMonth() === 0
      ? new Date(now.getFullYear() - 1, 11, now.getDate())
      : new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  return fromDate.toISOString().slice(0, 10);
};

const today = (): string => {
  // Today + 1 day - needed if the current day must be included
  const day: Date = new Date();
  day.setDate(day.getDate() + 1);
  const toDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  return toDate.toISOString().slice(0, 10);
};

export const AylikSatisMalilarsPage = (props: IAylikSatisMalilarsPageProps) => {
  const [fromDate, setFromDate] = useState(previousMonth());
  const [toDate, setToDate] = useState(today());

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getAllAylikSatisMalilars();
  }, [fromDate, toDate]);

  const onChangeFromDate = evt => setFromDate(evt.target.value);

  const onChangeToDate = evt => setToDate(evt.target.value);

  const getAllAylikSatisMalilars = () => {
    props.getAylikSatisMalilars();
  };

  const { aylikSatisMalilar } = props;

  return (
    <div>
      <h2 id="aylikSatisMalilars-page-heading">Aylık Satışlar</h2>
      {aylikSatisMalilar && aylikSatisMalilar.aylikSatisMap && aylikSatisMalilar.tarihListesi && aylikSatisMalilar.tarihListesi.length > 0 ? (
        <Table striped responsive>
          <thead>
          <tr>
            <th>Ürünler</th>
            {aylikSatisMalilar.tarihListesi.map((tarih, i) => (
              <th key={`tarihListesi-${i}`}>{tarih.slice(0, 7)}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {aylikSatisMalilar.urunAdiListesi.map((urun, i) => (
            <tr key={`urunAdiListesi-${i}`}>
              <td>{urun}</td>
              {aylikSatisMalilar.tarihListesi.map((tarihim, k) => (
                <td key={`map-${k}`}>
                  {aylikSatisMalilar.aylikSatisMap[tarihim.slice(0, 4) + '.' + tarihim.slice(5, 7) + urun]
                    ? aylikSatisMalilar.aylikSatisMap[tarihim.slice(0, 4) + '.' + tarihim.slice(5, 7) + urun]
                    : '-'}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-warning"></div>
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  aylikSatisMalilar: storeState.aylikSatislarMaliState.aylikSatisMalilar,
  totalItems: storeState.ciroState.totalItems,
});

const mapDispatchToProps = { getAylikSatisMalilars };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AylikSatisMalilarsPage);
