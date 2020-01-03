import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ISatisStokHareketleri } from 'app/shared/model/satis-stok-hareketleri.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './satis-stok-hareketleri.reducer';

export interface ISatisStokHareketleriDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SatisStokHareketleriDeleteDialog = (props: ISatisStokHareketleriDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/satis-stok-hareketleri');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.satisStokHareketleriEntity.id);
  };

  const { satisStokHareketleriEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="koopApp.satisStokHareketleri.delete.question">
        <Translate contentKey="koopApp.satisStokHareketleri.delete.question" interpolate={{ id: satisStokHareketleriEntity.id }}>
          Are you sure you want to delete this SatisStokHareketleri?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="koop-confirm-delete-satisStokHareketleri" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ satisStokHareketleri }: IRootState) => ({
  satisStokHareketleriEntity: satisStokHareketleri.entity,
  updateSuccess: satisStokHareketleri.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SatisStokHareketleriDeleteDialog);
