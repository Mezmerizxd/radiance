import { MdEdit } from 'react-icons/md';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField } from '../../../components/Form';
import { useUpdateAddress } from '../api/updateAddress';

const schema = z.object({
  street: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  postalCode: z.string(),
});

export const UpdateAddress = ({ address }: { address: Address }) => {
  const updateAddressMutation = useUpdateAddress();

  return (
    <FormDrawer
      isDone={updateAddressMutation.isSuccess}
      triggerButton={
        <Button startIcon={<MdEdit className="h-4 w-4" />} size="sm">
          Update Address
        </Button>
      }
      title="Update Address"
      submitButton={
        <Button form="update-address" type="submit" size="sm" isLoading={updateAddressMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<Address & Record<string, unknown>, typeof schema>
        id="update-address"
        onSubmit={async (values) => {
          await updateAddressMutation.mutateAsync({
            ...values,
            id: address.id,
            accountId: address.accountId,
          });
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              label="Street"
              error={formState.errors['street']}
              defaultValue={address.street}
              registration={register('street')}
            />
            <InputField
              label="City"
              type="text"
              error={formState.errors['city']}
              defaultValue={address.city}
              registration={register('city')}
            />
            <InputField
              label="State"
              error={formState.errors['state']}
              defaultValue={address.state}
              registration={register('state')}
            />
            <InputField
              label="Country"
              error={formState.errors['country']}
              defaultValue={address.country}
              registration={register('country')}
            />
            <InputField
              label="Postal Code"
              error={formState.errors['postalCode']}
              defaultValue={address.postalCode}
              registration={register('postalCode')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
