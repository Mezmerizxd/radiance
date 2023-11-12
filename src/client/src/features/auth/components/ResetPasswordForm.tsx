import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, InputField } from '../../../components/Form';
import { useNotificationStore } from '../../../stores/notifications';
import { useNavigate } from 'react-router-dom';
import { useResetPassword } from '../api/resetPassword';

const schema = z.object({
  password: z.string().min(1, 'Required'),
});

type ResetPasswordValues = {
  password: string;
};

type ResetPasswordFormProps = {
  onSuccess: () => void;
  code: string;
};

export const ResetPasswordForm = ({ onSuccess, code }: ResetPasswordFormProps) => {
  const resetPasswordMutation = useResetPassword();

  return (
    <div>
      <Form<ResetPasswordValues, typeof schema>
        onSubmit={async (values) => {
          await resetPasswordMutation.mutateAsync({ ...values, code }, { onSuccess: () => onSuccess() });
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              type="password"
              label="New Password"
              error={formState.errors['password']}
              registration={register('password')}
            />
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
