import { useMutation } from 'react-query';

import { MutationConfig, queryClient } from '../../../libs/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { engine } from '../../../libs/engine';

export type ConfirmRequestDTO = {
  bookingId: string;
};

export const confirmRequest = async ({ bookingId }: ConfirmRequestDTO) => {
  const response = await engine.ConfirmBooking({ bookingId: bookingId });
  if (!response.server.success) {
    throw new Error(response.server.error);
  }
  return response.data;
};

type UseConfirmRequestOptions = {
  config?: MutationConfig<typeof confirmRequest>;
};

export const useConfirmRequest = ({ config }: UseConfirmRequestOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (confirmRequest) => {
      await queryClient.cancelQueries('bookings');

      const previousBookings = queryClient.getQueryData<Booking[]>('bookings');

      queryClient.setQueryData(
        'bookings',
        previousBookings?.map((booking) => {
          if (booking.id === confirmRequest.bookingId) {
            return { ...booking, status: 'confirmed' };
          }
          return booking;
        }),
      );

      return { previousBookings };
    },
    onError: (error, __, context: any) => {
      if (context?.previousBookings) {
        queryClient.setQueryData('bookings', context.previousBookings);
      }
      addNotification({
        type: 'error',
        title: 'Failed to Confirm',
        message: error.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('bookings');
      addNotification({
        type: 'success',
        title: 'Confirmed',
      });
    },
    ...config,
    mutationFn: confirmRequest,
  });
};
