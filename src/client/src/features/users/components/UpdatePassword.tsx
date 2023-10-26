import { MdEdit } from 'react-icons/md';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField } from '../../../components/Form';
import { UpdatePasswordDTO, useUpdatePassword } from '../api/updatePassword';

const schema = z.object({
  password: z.string().min(1, 'Required'),
  newPassword: z.string().min(1, 'Required'),
});

export const UpdatePassword = () => {
  const updatePasswordMutation = useUpdatePassword();

  return (
    <FormDrawer
      isDone={updatePasswordMutation.isSuccess}
      triggerButton={
        <Button className="mx-4 my-5 sm:mx-6" startIcon={<MdEdit className="h-4 w-4" />} size="sm">
          Change Password
        </Button>
      }
      title="Update Password"
      submitButton={
        <Button form="update-password" type="submit" size="sm" isLoading={updatePasswordMutation.isLoading}>
          Submit
        </Button>
      }
    >
      <Form<UpdatePasswordDTO, typeof schema>
        id="update-password"
        onSubmit={async (values) => {
          await updatePasswordMutation.mutateAsync(values);
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              label="Password"
              type="password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <InputField
              label="New Password"
              type="password"
              error={formState.errors['newPassword']}
              registration={register('newPassword')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
