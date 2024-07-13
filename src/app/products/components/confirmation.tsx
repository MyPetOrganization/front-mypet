import { Button, Modal, Text } from "rsuite"

interface ConfirmationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setRemove: (remove: boolean) => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, setOpen, setRemove }) => {

    const handleClose = () => {
        setOpen(false);
        setRemove(false);
    };

    const handleConfirm = () => {
        setRemove(true);
        setOpen(false);
    };

    return (
        <>
            <Modal open={open} onClose={handleClose} size="xs" >
                <Modal.Header>
                    <Modal.Title>Confirmar acción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text>¿Esta seguro de eliminar el producto?</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleConfirm} appearance="primary">
                        Ok
                    </Button>
                    <Button onClick={handleClose} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmationModal;