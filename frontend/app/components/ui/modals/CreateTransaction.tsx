import { Button } from "~/components/lib/button";
import Modal from "../Modal";

interface CreateTransactionModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTransactionModal(props: CreateTransactionModalProps) {
  return (
    <Modal
      open={props.open}
      onOpenChange={props.setOpen}
      title="Delete Transaction"
      description="Are you sure you want to delete this transaction? This action cannot be undone."
      footer={
        <>
          <Button variant="ghost" onClick={() => props.setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete</Button>
        </>
      }
    >
      <p>Create your Transaction</p>
    </Modal>
  );
}
