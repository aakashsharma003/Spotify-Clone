import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Song } from '@/types';

const getLikedSongs = async (): Promise<Song[]> => {
  try {
    const supabase = createServerComponentClient({
      cookies: () => cookies(),
    });

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) return [];

    const { data, error } = await supabase
      .from('liked_songs')
      .select('*, songs(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error.message);
      return [];
    }

    if (!data) return [];

    return data.map((item) => ({ ...item.songs }));
  } catch (err: any) {
    console.log('[getLikedSongs]', err.message);
    return [];
  }
};

export default getLikedSongs;
