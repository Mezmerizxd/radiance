import { useMutation } from 'react-query';

import { MutationConfig } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type ForgotPasswordDTO = {
  email: string;
};

export const forgotPassword = async (data: ForgotPasswordDTO) => {
  const response = await engine.ForgotPassword({
    email: data.email,
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseForgotPasswordOptions = {
  config?: MutationConfig<typeof forgotPassword>;
};

export const useForgotPassword = ({ config }: UseForgotPasswordOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed',
        message: error.message,
      });
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Reset password email sent',
      });
    },
    ...config,
    mutationFn: forgotPassword,
  });
};
