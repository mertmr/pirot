import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Table} from 'reactstrap';

import {IRootState} from 'app/shared/reducers';
import {getAylikSatislars} from './aylik-satislar.reducer';

export interface IAylikSatislarsPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
}

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

export const AylikSatislarsPage = (props: IAylikSatislarsPageProps) => {
  const [fromDate, setFromDate] = useState(previousMonth());
  const [toDate, setToDate] = useState(today());

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getAllAylikSatislars();
  }, [fromDate, toDate]);

  const onChangeFromDate = evt => setFromDate(evt.target.value);

  const onChangeToDate = evt => setToDate(evt.target.value);

  const getAllAylikSatislars = () => {
    props.getAylikSatislars();
  };

  const {aylikSatislar} = props;

  return (
    <div>
      <h2 id="aylikSatislars-page-heading">Aylık Satışlar</h2>
      {aylikSatislar && aylikSatislar.aylikSatisMap && aylikSatislar.tarihListesi && aylikSatislar.tarihListesi.length > 0 ?  (
        <Table striped responsive>
          <thead>
          <tr>
            <th>
             Ürünler
            </th>
            {aylikSatislar.tarihListesi.map((tarih, i) => (
              <th key={`tarihListesi-${i}`}>
                {tarih.slice(0, 7)}
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {aylikSatislar.urunAdiListesi.map((urun, i) => (
            <tr key={`urunAdiListesi-${i}`}>
              <td>{urun}</td>
              {aylikSatislar.tarihListesi.map((tarihim, k) => (
                <td key={`map-${k}`}>
                  {aylikSatislar.aylikSatisMap[tarihim.slice(0, 4) + "." + tarihim.slice(5, 7) + urun] ?
                    aylikSatislar.aylikSatisMap[tarihim.slice(0, 4) + "." + tarihim.slice(5, 7) + urun] : '-'}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-warning">
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  aylikSatislar: storeState.aylikSatislarState.aylikSatislar,
  totalItems: storeState.ciroState.totalItems
});

const mapDispatchToProps = {getAylikSatislars};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AylikSatislarsPage);
