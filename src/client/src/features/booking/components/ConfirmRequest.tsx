import { Button, ConfirmationDialog } from '../../../components/Elements';
import { useConfirmRequest } from '../api/confirmRequest';

type ConfirmRequestProps = {
  bookingId: string;
  triggerButton?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

export const ConfirmRequest = ({ bookingId, triggerButton }: ConfirmRequestProps) => {
  const confirmRequestMutation = useConfirmRequest();

  return (
    <ConfirmationDialog
      icon="info"
      title="Confirm Request"
      body="Are you sure you want to confirm this request?"
      triggerButton={triggerButton ? triggerButton : <Button variant="primary">Confirm</Button>}
      confirmButton={
        <Button
          isLoading={confirmRequestMutation.isLoading}
          type="button"
          className="bg-radiance-dark"
          onClick={() => confirmRequestMutation.mutate({ bookingId: bookingId })}
        >
          Confirm Request
        </Button>
      }
    />
  );
};
