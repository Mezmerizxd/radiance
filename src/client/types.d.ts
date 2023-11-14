type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

interface Profile {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'DEVELOPER' | 'USER';
  avatar?: string | null;
  biography?: string | null;
  verifiedEmail?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Account {
  id: string;
  email: string;
  username: string;
  password: string;
  token?: string | null;
  tokenExp?: Date | null;
  role: 'ADMIN' | 'DEVELOPER' | 'USER';
  avatar?: string | null;
  biography?: string | null;
  verifiedEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Booking {
  id: string;
  date: Date;
  price: number;
  serviceType: number;
  paid: boolean;
  timeSlot: number;
  additionalNotes: string | null;
  paymentIntentId: string | null;
  confirmed: boolean;
  address: Address;
  account: Account;
  createdAt: Date;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  accountId: string;
}

interface Message {
  id: string;
  message: string;
  profile: Profile;
  createdAt: Date;
}

type PostEvents = {
  /* ACCOUNT */
  '/account/login': () => Account;
  '/account/create': () => Account;
  '/account/delete': () => null;
  '/account/addresses/delete': () => null;
  '/account/addresses/create': () => Address;
  '/account/email/verify': () => null;
  '/account/forgot-password': () => null;
  '/account/reset-password': () => null;

  /* BOOKING */
  '/bookings/cancel': () => null;
  '/bookings/is-date-booked': () => boolean;
  '/bookings/create': () => Booking;

  /* MESSAGES */
  '/messages/send': () => Message;
};

type GetEvents = {
  '/get-version': () => {
    server: string;
    client: string;
  };
  '/get-socket-details': () => {
    socketUrl: string;
  };

  /* ACCOUNT */
  '/account/profile': () => Profile;
  '/account/accounts': () => Account[];
  '/account/authorize': () => null;
  '/account/addresses': () => Address[] | null;

  /* BOOKING */
  '/bookings/get-all': () => Booking[];
  '/bookings/get': () => Booking;
};

type PatchEvents = {
  /* ACCOUNT */
  '/account/profile/update': () => Profile;
  '/account/addresses/update': () => Address;
  '/account/password/update': () => null;

  /* BOOKING */
  '/bookings/confirm': () => Booking;
  '/bookings/confirm-payment': () => Booking;
  '/bookings/reschedule': () => Booking;
  '/bookings/reschedule-confirmed': () => Booking;
};

type BaseResponse = {
  success: boolean;
  error: string;
};
