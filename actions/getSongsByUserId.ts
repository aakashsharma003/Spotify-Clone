import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Song } from '@/types';

const getSongsByUserId = async (): Promise<Song[]> => {
  try {
    const supabase = createServerComponentClient({
      cookies: () => cookies(),
    });

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) return [];

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error.message);
      return [];
    }

    return (data as any) || [];
  } catch (err: any) {
    console.log('[getSongsByUserId]', err.message);
    return [];
  }
};

export default getSongsByUserId;
