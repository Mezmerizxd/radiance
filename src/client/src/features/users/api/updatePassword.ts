import { useMutation } from 'react-query';

import { MutationConfig } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type UpdatePasswordDTO = {
  password: string;
  newPassword: string;
};

export const updatePassword = async (data: UpdatePasswordDTO) => {
  const response = await engine.UpdatePassword(data);
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseUpdatePasswordOptions = {
  config?: MutationConfig<typeof updatePassword>;
};

export const useUpdatePassword = ({ config }: UseUpdatePasswordOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Update Password',
        message: error.message,
      });
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Password Updated',
      });
    },
    ...config,
    mutationFn: updatePassword,
  });
};
