import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, InputField } from '../../../components/Form';
import { useNotificationStore } from '../../../stores/notifications';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../api/forgotPassword';

const schema = z.object({
  email: z.string().min(1, 'Required'),
});

type ForgotPasswordValues = {
  email: string;
};

type ForgotPasswordFormProps = {
  onSuccess: () => void;
};

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const forgotPasswordMutation = useForgotPassword();

  return (
    <div>
      <Form<ForgotPasswordValues, typeof schema>
        onSubmit={async (values) => {
          await forgotPasswordMutation.mutateAsync(values);
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField type="email" label="Email" error={formState.errors['email']} registration={register('email')} />
            <div>
              <Button type="submit" variant="inverse" className="w-full">
                Reset Password
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
