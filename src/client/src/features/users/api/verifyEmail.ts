import { useMutation } from 'react-query';

import { MutationConfig } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type VerifyEmailDTO = {
  code: string;
};

export const verifyEmail = async ({ code }: VerifyEmailDTO) => {
  const response = await engine.VerifyEmail({ code });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
};

type UseVerifyEmailOptions = {
  config?: MutationConfig<typeof verifyEmail>;
};

export const useVerifyEmail = ({ config }: UseVerifyEmailOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Verify Email',
        message: error.message,
      });
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Email Verified',
      });
    },
    ...config,
    mutationFn: verifyEmail,
  });
};
