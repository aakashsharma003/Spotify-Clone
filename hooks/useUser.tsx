import { useState, createContext, useEffect, useContext } from 'react';
import { User } from '@supabase/auth-helpers-nextjs';
import {
  useSessionContext,
  useUser as useSupaUser,
} from '@supabase/auth-helpers-react';

import { Subscription, UserDetails } from '@/types';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const mockUser = {
    id: 'mock-akash-sharma-id',
    email: 'akash@spotify.com',
    user_metadata: {
      full_name: 'Akash Sharma',
    },
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    app_metadata: {},
  } as User;

  const mockUserDetails = {
    id: 'mock-akash-sharma-id',
    first_name: 'Akash',
    last_name: 'Sharma',
    full_name: 'Akash Sharma',
    avatar_url: undefined,
  };

  const mockSubscription = {
    id: 'mock-subscription-id',
    user_id: 'mock-akash-sharma-id',
    status: 'active',
    created: new Date().toISOString(),
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    prices: {
      id: 'mock-price-id',
      active: true,
      currency: 'usd',
      unit_amount: 999,
      type: 'recurring',
      products: {
        id: 'mock-product-id',
        active: true,
        name: 'Spotify Premium Admin',
        description: 'Full Premium Access with Admin Rights',
      }
    }
  } as any;

  const value = {
    accessToken: 'mock-access-token',
    user: mockUser,
    userDetails: mockUserDetails,
    isLoading: false,
    subscription: mockSubscription,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider`);
  }

  return context;
};
