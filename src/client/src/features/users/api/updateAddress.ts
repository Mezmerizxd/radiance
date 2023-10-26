import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export const updateAddress = async (data: Address) => {
  const response = await engine.UpdateAddress(data);
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseUpdateAddressOptions = {
  config?: MutationConfig<typeof updateAddress>;
};

export const useUpdateAddress = ({ config }: UseUpdateAddressOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (updateAddress) => {
      await queryClient.cancelQueries('addresses');

      const previousAddresses = queryClient.getQueryData<Address[]>('addresses');

      queryClient.setQueryData(
        'addresses',
        previousAddresses?.map((address) => {
          if (address.id === updateAddress.id) {
            return { ...address, ...updateAddress };
          }
          return address;
        }),
      );

      return { previousAddresses };
    },
    onError: (error, __, context: any) => {
      addNotification({
        type: 'error',
        title: 'Failed to Update Address',
        message: error.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('addresses');
      addNotification({
        type: 'success',
        title: 'Address Updated',
      });
    },
    ...config,
    mutationFn: updateAddress,
  });
};
