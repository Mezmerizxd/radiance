import { format } from 'date-fns';
import { Spinner } from '../../../components/Elements';
import Calendar from '../../../components/Elements/Calendar/Calendar';
import { ContentLayout } from '../../../components/Layout';
import { Authorization, ROLES } from '../../../libs/authorization';
import { useBookings } from '../api/getBookings';
import { CreateOrder } from '../components/CreateOrder';
import { useAuth } from '../../../libs/auth';
import { EditOrder } from '../components/EditOrder';

export const Order = () => {
  const { user } = useAuth();
  const bookingsQuery = useBookings();

  if (bookingsQuery.isLoading) {
    return (
      <div className="w-full h-48 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ContentLayout title="Order">
      <div className="mt-4">
        <Authorization
          forbiddenFallback={<div>Only user can view this.</div>}
          allowedRoles={[ROLES.USER, ROLES.DEVELOPER, ROLES.ADMIN]}
        >
          <div className="text-md my-2 py-2">
            <p className="flex">
              Create an order by selecting the
              <span>
                <div className="w-fit border p-0.5 mx-1 rounded-md border-green-500/50 bg-green-500/10 text-green-500 text-xs">
                  <p>Book</p>
                </div>
              </span>
              option on the calendar and filling out the details.
            </p>
            <p>Once you have created an order, it will be sent to an Admin where they can Confirm the request.</p>
          </div>
          <Calendar<Booking>
            entries={bookingsQuery?.data ? bookingsQuery?.data?.filter((booking) => booking.confirmed) : []}
            dateField="date"
            renderCell={(day) => {
              let isBooked = false;
              if (bookingsQuery?.data) {
                for (let i = 0; i < bookingsQuery?.data?.length; i++) {
                  const booking = bookingsQuery.data[i];
                  const bookingDate = new Date(booking.date);
                  if (format(bookingDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')) {
                    isBooked = true;
                    return (
                      <>
                        <EditOrder booking={booking} />
                        <div className="pt-1">
                          {booking.account.id === user.profile.id &&
                            (booking.confirmed ? (
                              <div className="w-fit border p-1 rounded-md border-green-500/50 bg-green-500/10 text-green-500 text-xs">
                                <p>Confirmed</p>
                              </div>
                            ) : (
                              <div className="w-fit border p-1 rounded-md border-red-600/50 bg-red-600/10 text-red-600 text-xs">
                                <p>Not Confirmed</p>
                              </div>
                            ))}
                        </div>
                      </>
                    );
                  }
                }
              }

              if (!isBooked) {
                if (day.getTime() > new Date().getTime()) {
                  return <CreateOrder date={day} />;
                }
              }
            }}
          />
        </Authorization>
      </div>
    </ContentLayout>
  );
};
