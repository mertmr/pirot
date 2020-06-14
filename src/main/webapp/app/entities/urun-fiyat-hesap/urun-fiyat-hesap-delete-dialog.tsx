import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IUrunFiyatHesap } from 'app/shared/model/urun-fiyat-hesap.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './urun-fiyat-hesap.reducer';

export interface IUrunFiyatHesapDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UrunFiyatHesapDeleteDialog = (props: IUrunFiyatHesapDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/urun-fiyat-hesap' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.urunFiyatHesapEntity.id);
  };

  const { urunFiyatHesapEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="koopApp.urunFiyatHesap.delete.question">
        <Translate contentKey="koopApp.urunFiyatHesap.delete.question" interpolate={{ id: urunFiyatHesapEntity.id }}>
          Are you sure you want to delete this UrunFiyatHesap?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="koop-confirm-delete-urunFiyatHesap" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ urunFiyatHesap }: IRootState) => ({
  urunFiyatHesapEntity: urunFiyatHesap.entity,
  updateSuccess: urunFiyatHesap.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UrunFiyatHesapDeleteDialog);
