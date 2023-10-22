import * as z from 'zod';

import { Button, ConfirmationDialog } from '../../../components/Elements';
import { Form, FormDrawer, SelectField, TextAreaField } from '../../../components/Form';
import { CreateOrderDTO, useCreateOrder } from '../api/createOrder';
import { useAddresses } from '../../users/api/getAddresses';
import { useNavigate } from 'react-router';

const schema = z.object({
  serviceType: z.string().min(0, 'Required'),
  addressId: z.string().min(0, 'Required'),
  timeSlot: z.string().min(0, 'Required'),
  additionalNotes: z.string().optional(),
});

export const CreateOrder = ({ date }: { date: Date }) => {
  const createOrderMutation = useCreateOrder();
  const addressesQuery = useAddresses();

  if (addressesQuery?.data.length <= 0) {
    const navigate = useNavigate();
    return (
      <ConfirmationDialog
        icon="danger"
        title="No Address Found"
        body="You need to add an address before you can start booking. Go to your Profile to add it."
        triggerButton={
          <div className="w-fit border p-1 rounded-md border-green-500/50 bg-green-500/10 text-green-500 text-xs">
            <p>Book</p>
          </div>
        }
        confirmButton={
          <Button
            type="button"
            className="bg-radiance-dark"
            onClick={() => {
              navigate('/app/profile');
            }}
          >
            Add Address
          </Button>
        }
      />
    );
  }

  return (
    <FormDrawer
      isDone={createOrderMutation.isSuccess}
      triggerButton={
        <div className="w-fit border p-1 rounded-md border-green-500/50 bg-green-500/10 text-green-500 text-xs">
          <p>Book</p>
        </div>
      }
      title="Create Order"
      submitButton={
        <Button form="create-order" type="submit" size="sm" isLoading={createOrderMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<CreateOrderDTO, typeof schema>
        id="create-order"
        onSubmit={async (values) => {
          await createOrderMutation.mutateAsync({
            ...values,
            date: date,
          });
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <SelectField
              label="Service Type"
              error={formState.errors['serviceType']}
              registration={register('serviceType')}
              options={[
                { label: '£30 - Quick', value: '0' },
                { label: '£45 - Normal', value: '1' },
                { label: '£60 - Extra', value: '2' },
              ]}
            />
            {addressesQuery?.data?.length > 0 && (
              <SelectField
                label="Address"
                error={formState.errors['addressId']}
                registration={register('addressId')}
                defaultValue=""
                options={addressesQuery?.data?.map((address) => ({
                  label: `${address.street}, ${address.city}, ${address.state}`,
                  value: address.id,
                }))}
              />
            )}
            <SelectField
              label="Time Slot"
              error={formState.errors['timeSlot']}
              registration={register('timeSlot')}
              options={[
                { label: '8am - 10am', value: '0' },
                { label: '11am - 1pm', value: '1' },
                { label: '2pm - 4pm', value: '2' },
                { label: '5pm - 7pm', value: '3' },
              ]}
            />
            <TextAreaField
              label="Additional Notes"
              error={formState.errors['additionalNotes']}
              registration={register('additionalNotes')}
            />

            <div className="text-md text-white-dark space-y-2">
              <p>When the order is confirmed, you cannot change the Time Slot or Cancel the order.</p>
              <p>Payment will be done through Stripe and a Payment Link will be sent to you by Email.</p>
            </div>
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
