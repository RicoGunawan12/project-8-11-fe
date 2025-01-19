import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react';
import { useEffect } from 'react';

interface DeleteConfirmationModalProps {
  onDelete: () => void;
  isVisible: boolean;
  onCancel: () => void;
  header: string
  description: string
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  header,
  description,
  isVisible, 
  onDelete, 
  onCancel 
}) => {
  return (
    <Modal
    
      backdrop="opaque" 
      isOpen={isVisible}
      onClose={onCancel}
      closeButton={false}
      className='text-black'
    >
      <ModalContent>
        {/* Modal Header */}
        <ModalHeader>
          <h4 className="font-bold text-lg">
            {header}
          </h4>
        </ModalHeader>

        {/* Modal Body */}
        <ModalBody>
          <p className="text-base">
            {description}
          </p>
        </ModalBody>

        {/* Modal Footer */}
        <ModalFooter>
          <Button color="secondary" variant="solid" onPress={onCancel}>
            Close
          </Button>
          <Button color="danger" className='bg-red-500' variant="solid" onPress={onDelete}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
