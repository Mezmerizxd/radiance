import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';
import { useAddresses } from './getAddresses';

export type CreateAddressDTO = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export const createAddress = async (data: CreateAddressDTO) => {
  const response = await engine.CreateAddress({
    id: '0',
    street: data.street,
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
    accountId: '0',
  });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseCreateAddressOptions = {
  config?: MutationConfig<typeof createAddress>;
};

export const useCreateAddress = ({ config }: UseCreateAddressOptions = {}) => {
  const { addNotification } = useNotificationStore();
  const addressesQuery = useAddresses();

  return useMutation({
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Create Address',
        message: error.message,
      });
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Create Address',
      });
      addressesQuery.refetch();
    },
    ...config,
    mutationFn: createAddress,
  });
};
