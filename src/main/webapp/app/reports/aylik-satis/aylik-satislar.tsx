import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import { getAylikSatislars } from './aylik-satislar.reducer';
import { Dropdown } from "primereact/dropdown";
import { defaultValue } from "app/shared/model/urun.model";
import { getAllUrunForStokGirisi } from "app/entities/urun/urun.reducer";
import { TextFormat } from "react-jhipster";
import { APP_DATE_FORMAT } from "app/config/constants";

export interface IAylikSatislarsPageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const AylikSatislarsPage = (props: IAylikSatislarsPageProps) => {

  const [urun, setUrun] = useState(defaultValue);

  useEffect(() => {
    props.getAllUrunForStokGirisi();
  }, []);

  const updateStokGirisi = e => {
    props.getAylikSatislars(e.target.value.id);
    setUrun(e.target.value);
  };

  const { aylikSatislar, satisUrunleri } = props;

  return (
    <div>
      <h2 id="aylikSatislars-page-heading">Aylık Satışlar</h2>
      <AvForm>
        <span>Tükenme Raporunu Öğrenmek İstediğiniz Ürünü Seçin</span>
        <AvGroup>
          <Dropdown
            value={urun}
            options={satisUrunleri}
            optionLabel="urunAdi"
            style={{ width: '100%' }}
            onChange={updateStokGirisi}
            filter={true}
            filterPlaceholder="Ürün seçiniz"
            filterBy="urunAdi"
            placeholder="Ürün seçiniz"
          />
        </AvGroup>
      </AvForm>
      {aylikSatislar && aylikSatislar.length > 0 ? (
        <Table striped responsive>
          <thead>
          <tr>
            <th>Satış Tarihi</th>
            <th>Satış Miktarı</th>
          </tr>
          </thead>
          <tbody>
          {aylikSatislar.map((aylikSatis, i) => (
            <tr key={`aylikSatis-${i}`}>
              <td>
                {aylikSatis.year} - {aylikSatis.month}
              </td>
              <td>{aylikSatis.miktar}</td>
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
  aylikSatislar: storeState.aylikSatislarState.aylikSatislar,
  totalItems: storeState.ciroState.totalItems,
  satisUrunleri: storeState.urun.satisUrunleri,
});

const mapDispatchToProps = {
  getAylikSatislars,
  getAllUrunForStokGirisi,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AylikSatislarsPage);
