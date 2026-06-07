import { Song } from '@/types';

import { useUser } from './useUser';
import usePlayer from './usePlayer';
import useAuthModal from './useAuthModal';
import useSubscribeModal from './useSubscribeModal';

const useOnPlay = (songs: Song[]) => {
  const { setId, setIds, setUnshuffledIds } = usePlayer();

  const onPlay = (id: string) => {
    setId(id);
    const ids = songs.map((song) => song.id);
    setIds(ids);
    setUnshuffledIds(ids);
  };

  return onPlay;
};

export default useOnPlay;
