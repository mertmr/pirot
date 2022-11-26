import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate, ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IUreticiOdemeleri } from 'app/shared/model/uretici-odemeleri.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './uretici-odemeleri.reducer';

export interface IUreticiOdemeleriDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UreticiOdemeleriDeleteDialog = (props: IUreticiOdemeleriDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/uretici-odemeleri' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.ureticiOdemeleriEntity.id);
  };

  const { ureticiOdemeleriEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        <Translate contentKey="entity.delete.title">Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id="koopApp.ureticiOdemeleri.delete.question">
        <Translate contentKey="koopApp.ureticiOdemeleri.delete.question" interpolate={{ id: ureticiOdemeleriEntity.id }}>
          Are you sure you want to delete this UreticiOdemeleri?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button id="koop-confirm-delete-ureticiOdemeleri" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ ureticiOdemeleri }: IRootState) => ({
  ureticiOdemeleriEntity: ureticiOdemeleri.entity,
  updateSuccess: ureticiOdemeleri.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UreticiOdemeleriDeleteDialog);
