import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Link, RouteComponentProps} from 'react-router-dom';
import {Badge, Button, Col, Label, Row, UncontrolledTooltip} from 'reactstrap';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {Translate, translate} from 'react-jhipster';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IRootState} from 'app/shared/reducers';
import {getEntities as getKdvKategorisis} from 'app/entities/kdv-kategorisi/kdv-kategorisi.reducer';
import {createEntity, getEntity, getUreticis, getUrunUsers, reset, updateEntity} from "./urun.reducer";
import {defaultValue} from 'app/shared/model/urun.model';
import {Dropdown} from 'primereact/dropdown';
import {hasAnyAuthority} from 'app/shared/auth/private-route';
import {AUTHORITIES} from 'app/config/constants';

export interface IUrunUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const UrunUpdate = (props: IUrunUpdateProps) => {
  const [urunState, setUrunState] = useState(defaultValue);
  const [kdvKategorisiId, setKdvKategorisiId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const {urunEntity, ureticis, urunUsers, kdvKategorisis, loading, updating, isAdmin} = props;

  const handleClose = () => {
    props.history.push('/urun' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUrunUsers();
    props.getKdvKategorisis();
    props.getUreticis();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    setUrunState({...urunEntity});
  }, [urunEntity]);

  const onChangeValue = e => {
    setUrunState({
      ...urunState,
      [e.target.name]: e.target.value,
    });
  };

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...urunEntity,
        ...urunState,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="koopApp.urun.home.createOrEditLabel">
            <Translate contentKey="koopApp.urun.home.createOrEditLabel">Create or edit a Urun</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : urunEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="urun-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="urun-id" type="text" className="form-control" name="id" required readOnly/>
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="urunAdiLabel" for="urun-urunAdi">
                  <Translate contentKey="koopApp.urun.urunAdi">Urun Adi</Translate>
                </Label>
                <AvField
                  id="urun-urunAdi"
                  disabled={!isAdmin}
                  type="text"
                  name="urunAdi"
                  validate={{
                    required: {value: true, errorMessage: translate('entity.validation.required')},
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="musteriFiyatiLabel" for="urun-musteriFiyati">
                  <Translate contentKey="koopApp.urun.musteriFiyati">Musteri Fiyati</Translate>
                </Label>
                <AvField id="urun-musteriFiyati" type="text" name="musteriFiyati" disabled={!isAdmin} required/>
              </AvGroup>
              <AvGroup>
                <Label id="birimLabel" for="urun-birim">
                  <Translate contentKey="koopApp.urun.birim">Birim</Translate>
                </Label>
                <AvInput
                  id="urun-birim"
                  type="select"
                  className="form-control"
                  name="birim"
                  disabled={!isAdmin}
                  value={(!isNew && urunEntity.birim) || 'ADET'}
                >
                  <option value="ADET">{translate('koopApp.Birim.ADET')}</option>
                  <option value="GRAM">{translate('koopApp.Birim.GRAM')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup check>
                <Label id="dayanismaUrunuLabel">
                  <AvInput
                    id="urun-dayanismaUrunu"
                    type="checkbox"
                    disabled={!isAdmin}
                    className="form-check-input"
                    name="dayanismaUrunu"
                  />
                  <Translate contentKey="koopApp.urun.dayanismaUrunu">Dayanisma Urunu</Translate>
                </Label>
              </AvGroup>
              <AvGroup check>
                <Label id="satistaLabel">
                  <AvInput id="urun-satista" type="checkbox" disabled={!isAdmin} className="form-check-input"
                           name="satista" value={(isNew) ? true : urunEntity.satista}/>
                  <Translate contentKey="koopApp.urun.satista">Satista</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="urunKategorisiLabel" for="urun-urunKategorisi">
                  <Translate contentKey="koopApp.urun.urunKategorisi">Urun Kategorisi</Translate>
                </Label>
                <AvInput
                  id="urun-urunKategorisi"
                  type="select"
                  disabled={!isAdmin}
                  className="form-control"
                  name="urunKategorisi"
                  value={(!isNew && urunEntity.urunKategorisi) || 'GIDA'}
                >
                  <option value="GIDA">{translate('koopApp.UrunKategorisi.GIDA')}</option>
                  <option value="GIDA_DISI">{translate('koopApp.UrunKategorisi.GIDA_DISI')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <div>
                  <Label for="urun-uretici">
                    Üretici
                  </Label>
                </div>
                <div>
                  <Dropdown
                    value={urunState.uretici}
                    options={ureticis}
                    optionLabel="adi"
                    onChange={onChangeValue}
                    filter={true}
                    name="uretici"
                    style={{width: '400px'}}
                    filterPlaceholder="Üretici Ara"
                    filterBy="login"
                    placeholder="Üretici seçin"
                  />
                </div>
              </AvGroup>
              <AvGroup>
                <span>
                  <Label id="stokSiniriLabel" for="urun-stokSiniri">
                    <Translate contentKey="koopApp.urun.stokSiniri">Stok Siniri</Translate>
                  </Label>
                  <Badge id="stok-siniri-info" style={{marginLeft: '5px'}} color="info">
                    Bilgi
                  </Badge>
                  <AvField id="urun-stokSiniri" type="text" name="stokSiniri"/>
                  <UncontrolledTooltip placement={'right'} target={'stok-siniri-info'}>
                    Opsiyonel alan: Bu ürünün stok miktarı buraya gireceğiniz stok sınırı altına indiğinde o ürünün sorumlusuna mail atar.
                    Ürün sorumlusu seçmeyi unutmayın!
                  </UncontrolledTooltip>
                </span>
              </AvGroup>
              <AvGroup>
                <div>
                  <Label for="urun-urunSorumlusu">
                    <Translate contentKey="koopApp.urun.urunSorumlusu">Urun Sorumlusu</Translate>
                  </Label>
                </div>
                <div>
                  <Dropdown
                    value={urunState.urunSorumlusu}
                    options={urunUsers}
                    optionLabel="login"
                    onChange={onChangeValue}
                    filter={true}
                    name="urunSorumlusu"
                    style={{width: '400px'}}
                    filterPlaceholder="Sorumlu Ara"
                    filterBy="login"
                    placeholder="Ürün sorumlusu seçin"
                  />
                </div>
              </AvGroup>
              <AvGroup>
                <Label for="urun-kdvKategorisi">
                  <Translate contentKey="koopApp.urun.kdvKategorisi">Kdv Kategorisi</Translate>
                </Label>
                <AvInput
                  id="urun-kdvKategorisi"
                  type="select"
                  disabled={!isAdmin}
                  className="form-control"
                  name="kdvKategorisi.id"
                  value={isNew ? kdvKategorisis[0] && kdvKategorisis[0].id : urunEntity.kdvKategorisi?.id}
                  required
                >
                  <option value="" key="0"/>
                  {kdvKategorisis
                    ? kdvKategorisis.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.kategoriAdi}
                      </option>
                    ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/urun" replace color="info">
                <FontAwesomeIcon icon="arrow-left"/>
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save"/>
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  users: storeState.userManagement.users,
  kdvKategorisis: storeState.kdvKategorisi.entities,
  urunEntity: storeState.urun.entity,
  urunUsers: storeState.urun.users,
  ureticis: storeState.urun.ureticis,
  loading: storeState.urun.loading,
  updating: storeState.urun.updating,
  updateSuccess: storeState.urun.updateSuccess,
  isAdmin: hasAnyAuthority(storeState.authentication.account.authorities, [AUTHORITIES.ADMIN]),
});

const mapDispatchToProps = {
  getKdvKategorisis,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getUrunUsers,
  getUreticis,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunUpdate);
