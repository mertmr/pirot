import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Table} from 'reactstrap';
import {Translate} from 'react-jhipster';

import {IRootState} from 'app/shared/reducers';
import {getOrtakFaturaDetaylar} from "app/reports/ortak-faturalar/ortak-faturalar.reducer";

export interface IOrtakFaturaDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const OrtakFaturaDetail = (props: IOrtakFaturaDetailProps) => {
  useEffect(() => {
    props.getOrtakFaturaDetaylar(props.match.params.id);
  }, []);

  const {ortakFaturaDetaylar} = props;
  return (
    <div>
      <h2 id="OrtakFaturalar-page-heading">Ortak Fatura Detayıları</h2>
      <div className="table-responsive">
        {ortakFaturaDetaylar && ortakFaturaDetaylar.ortakFaturasiDetayDto && ortakFaturaDetaylar.ortakFaturasiDetayDto.length > 0 ? (
          <Table responsive>
            <thead>
            <tr>
              <th className="hand">
                Ürün Adı
              </th>
              <th className="hand">
                Miktar
              </th>
              <th className="hand">
                Birim Fiyat
              </th>
              <th className="hand">
                Toplam Tutar
              </th>
            </tr>
            </thead>
            <tbody>
            <tr/>
            {ortakFaturaDetaylar.ortakFaturasiDetayDto.map((ortakFaturaDetay, i) => (
              <tr key={`entity-${i}`}>
                <td>{ortakFaturaDetay.urunAdiKdv}</td>
                <td>{ortakFaturaDetay.miktar}</td>
                <td>{ortakFaturaDetay.birimFiyat}</td>
                <td>{ortakFaturaDetay.toplamTutar}</td>
              </tr>
            ))}
            <tr>
              <td/>
              <td/>
              <td>KDV Hariç Toplam</td>
              <td>{ortakFaturaDetaylar.tumToplamKdvHaric}</td>
            </tr>
            {ortakFaturaDetaylar.kdvToplamList.map((kdv, i) => (
              <tr key={`entity-${i}`}>
                <td/>
                <td/>
                <td>{kdv.kdvKategorisi}</td>
                <td>{kdv.kdvTutari}</td>
              </tr>
            ))}
            <tr>
              <td/>
              <td/>
              <td>Toplam</td>
              <td>{ortakFaturaDetaylar.tumToplam}</td>
            </tr>
            </tbody>
          </Table>
        ) : (
          <div className="alert alert-warning">
            <Translate contentKey="koopApp.kisiler.home.notFound">No Kisilers found</Translate>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  ortakFaturaDetaylar: storeState.ortakFaturalarState.ortakFaturaDetaylar
});

const mapDispatchToProps = {getOrtakFaturaDetaylar};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OrtakFaturaDetail);
