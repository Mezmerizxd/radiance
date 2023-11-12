import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, InputField } from '../../../components/Form';
import { useAuth } from '../../../libs/auth';
import { useNotificationStore } from '../../../stores/notifications';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

type LoginValues = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const { login, isLoggingIn } = useAuth();

  return (
    <div>
      <Form<LoginValues, typeof schema>
        onSubmit={async (values) => {
          const response = await login(values);
          if (response.profile) {
            onSuccess();
          } else {
            addNotification({
              type: 'error',
              title: 'Failed to login',
              message: response.error,
            });
          }
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              type="text"
              label="Username"
              error={formState.errors['username']}
              registration={register('username')}
            />
            <InputField
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <div>
              <Button isLoading={isLoggingIn} type="submit" variant="inverse" className="w-full">
                Log in
              </Button>
            </div>
            <p
              className="text-white-dark text-md text-center hover:text-white-light cursor-pointer"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Forgotton your password?
            </p>
          </>
        )}
      </Form>
    </div>
  );
};
