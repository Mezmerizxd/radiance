import { useMutation } from 'react-query';

import { MutationConfig } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type ResetPasswordDTO = {
  code: string;
  password: string;
};

export const resetPassword = async (data: ResetPasswordDTO) => {
  const response = await engine.ResetPassword({
    code: data.code,
    password: data.password,
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseResetPasswordOptions = {
  config?: MutationConfig<typeof resetPassword>;
};

export const useResetPassword = ({ config }: UseResetPasswordOptions = {}) => {
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
        title: 'Reset password',
      });
    },
    ...config,
    mutationFn: resetPassword,
  });
};
