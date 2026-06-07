import { useState, useEffect, useMemo } from 'react';

import { Song } from '@/types';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { getSongDetails } from '@/libs/musicApi';

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (isUuid) {
        const { data, error } = await supabaseClient
          .from('songs')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setSong(data as Song);
          setIsLoading(false);
          return;
        }
      }

      try {
        const jioSong = await getSongDetails(id);
        if (jioSong) {
          setSong(jioSong);
        } else {
          setSong(undefined);
        }
      } catch (err) {
        console.error("Failed to fetch JioSaavn song details:", err);
      }
      setIsLoading(false);
    };

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song],
  );
};

export default useGetSongById;
