import * as z from 'zod';
import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, SelectField, TextAreaField } from '../../../components/Form';
import { EditOrderDTO, useEditOrder } from '../api/editOrder';
import { ConfirmRequest } from './ConfirmRequest';
import { useAuth } from '../../../libs/auth';

const schema = z.object({
  timeSlot: z.string(),
});

export const EditOrder = ({ booking }: { booking: Booking }) => {
  const { user } = useAuth();
  const editOrderMutation = useEditOrder();

  if (booking.account.id !== user.profile.id) {
    return (
      <div className="w-fit border p-1 rounded-md border-red-600/50 bg-red-600/10 text-red-600 text-xs">
        <p>Booked</p>
      </div>
    );
  }

  return (
    <FormDrawer
      isDone={editOrderMutation.isSuccess}
      triggerButton={
        <div className="w-fit border p-1 rounded-md border-red-600/50 bg-red-600/10 text-red-600 text-xs">
          <p>Booked</p>
        </div>
      }
      title="Edit Order"
      submitButton={
        <Button form="edit-order" type="submit" size="sm" isLoading={editOrderMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<EditOrderDTO, typeof schema>
        id="edit-order"
        onSubmit={async (values) => {
          await editOrderMutation.mutateAsync({
            date: new Date(),
            bookingId: booking.id,
            timeSlot: values.timeSlot,
          });
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              label="Date"
              error={formState.errors['date']}
              registration={register('date')}
              defaultValue={new Date(booking.date).toDateString()}
              disabled={true}
              type="text"
            />
            <InputField
              label="Address"
              registration={null}
              defaultValue={`${booking.address.street}, ${booking.address.city}, ${booking.address.postalCode}`}
              disabled={true}
              type="text"
            />
            <SelectField
              label="Service Type"
              registration={null}
              defaultValue={String(booking.serviceType)}
              disabled={true}
              options={[
                { label: '£30 - Quick', value: '0' },
                { label: '£45 - Normal', value: '1' },
                { label: '£60 - Extra', value: '2' },
              ]}
            />
            <SelectField
              label="Time Slot"
              error={formState.errors['timeSlot']}
              registration={register('timeSlot')}
              defaultValue={String(booking.timeSlot)}
              disabled={booking.confirmed ? true : false}
              options={[
                { label: '8am - 10am', value: '0' },
                { label: '11am - 1pm', value: '1' },
                { label: '2pm - 4pm', value: '2' },
                { label: '5pm - 7pm', value: '3' },
              ]}
            />
            <TextAreaField
              label="Additional Notes"
              registration={null}
              defaultValue={booking.additionalNotes}
              disabled={true}
            />
            {booking.confirmed === true && (
              <InputField
                label="Payment Intent ID"
                registration={null}
                defaultValue={booking?.paymentIntentId}
                disabled={true}
                type="text"
              />
            )}
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
