import React from "react";
import { Modal } from "antd";

interface ConfirmationModalProps {
  isModalOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isModalOpen,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title="Are you sure you want to delete this time entry?"
      open={isModalOpen}
      onOk={onOk}
      okText="Yes"
      onCancel={onCancel}
      cancelText="No"
      data-cy="confirmation-modal"
    >
      <p className="pb-6"></p>
    </Modal>
  );
};

export default ConfirmationModal;
