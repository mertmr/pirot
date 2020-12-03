import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import { Button, Input, Row, Table } from 'reactstrap';
import {AvForm, AvGroup} from 'availity-reactstrap-validation';
import {IRootState} from 'app/shared/reducers';
import {getTukenmeHizi} from './tukenme.reducer';
import {Dropdown} from "primereact/dropdown";
import {getAllUrunForStokGirisi} from "app/entities/urun/urun.reducer";
import {findOnlyStokGirisiByUrun} from "app/entities/stok-girisi/stok-girisi.reducer";
import {defaultValue} from "app/shared/model/urun.model";
import {convertDateTimeFromServer, convertDateTimeToServer, convertDateToString} from "app/shared/util/date-utils";
import {APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, APP_LOCAL_DATETIME_FORMAT} from "app/config/constants";
import {TextFormat, Translate} from "react-jhipster";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface ITukenmePageProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
}

export const TukenmePage = (props: ITukenmePageProps) => {

  const [stokGirisi, setStokGirisi] = useState('');
  const [urun, setUrun] = useState(defaultValue);

  useEffect(() => {
    props.getAllUrunForStokGirisi();
  }, []);

  const getAllTukenme = e => {
    const stokTarihi = convertDateToString(e.target.value.stokGirisiTarihi);
    props.getTukenmeHizi(stokTarihi, urun.id);
    setStokGirisi(e.target.value);
  };

  const updateStokGirisi = e => {
    props.findOnlyStokGirisiByUrun(e.target.value.id);
    setUrun(e.target.value);
  };

  const {satisUrunleri, stokGirisiList, tukenme} = props;

  return (
    <div>
      <h2 id="tukenme-page-heading">Ürün Tükenme Hızı Raporu</h2>
      <AvForm>
        <span>Tükenme Hızını Öğrenmek İstediğiniz Ürünü Seçin</span>
        <AvGroup>
          <Dropdown
            value={urun}
            options={satisUrunleri}
            optionLabel="urunAdi"
            style={{width: '100%'}}
            onChange={updateStokGirisi}
            filter={true}
            filterPlaceholder="Ürün seçiniz"
            filterBy="urunAdi"
            placeholder="Ürün seçiniz"
          />
        </AvGroup>
        <span>Tükenme Hızını Öğrenmek İstediğiniz Stok Girişi Periyodunu Seçiniz</span>
        <AvGroup>
          <Dropdown
            value={stokGirisi}
            options={stokGirisiList}
            optionLabel="stokGirisAciklamasi"
            onChange={getAllTukenme}
            style={{width: '100%'}}
          />
        </AvGroup>
        <AvGroup>
          <span>Aylık Tükenme Hızı: {tukenme.aylikTukenmeHizi}</span>
        </AvGroup>
        <AvGroup>
          <span>Haftalık Tükenme Hızı: {tukenme.haftalikTukenmeHizi}</span>
        </AvGroup>
        <AvGroup>
          <span>Rapor Veri Ölçek Süresi: {tukenme.raporVeriOlcekSuresi} gün</span>
        </AvGroup>
        {tukenme.stokGunluguList && tukenme.stokGunluguList.length > 0 ? (
        <Table striped responsive>
          <thead>
          <tr>
            <th>Satış Tarihi</th>
            <th>Satış Miktarı</th>
          </tr>
          </thead>
          <tbody>
          {tukenme.stokGunluguList.map((stokGunlugu, i) => (
            <tr key={`stokGunlugu-${i}`}>
              <td><TextFormat type="date" value={stokGunlugu.satis.tarih} format={APP_DATE_FORMAT} /></td>
              <td>{stokGunlugu.miktar}</td>
            </tr>
          ))}
          </tbody>
        </Table>
        ) : (
          <div className="alert alert-warning"></div>
        )}
      </AvForm>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  tukenme: storeState.tukenmeState.tukenme,
  totalItems: storeState.ciroState.totalItems,
  satisUrunleri: storeState.urun.satisUrunleri,
  stokGirisiList: storeState.stokGirisi.stokGirisiByurunList,
});

const mapDispatchToProps = {
  getTukenmeHizi,
  getAllUrunForStokGirisi,
  findOnlyStokGirisiByUrun,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TukenmePage);
