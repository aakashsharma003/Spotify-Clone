'use client';

import { MdLibraryMusic } from 'react-icons/md';
import { AiOutlinePlus, AiFillHeart } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { HiListBullet } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';

import { Song } from '@/types';
import useAuthModal from '@/hooks/useAuthModal';
import useUploadModal from '@/hooks/useUploadModal';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import useOnPlay from '@/hooks/useOnPlay';

import MediaItem from './MediaItem';

interface LibraryProps {
  songs: Song[];
}

const Library = ({ songs }: LibraryProps) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const subscribeModal = useSubscribeModal();
  const { user, subscription } = useUser();
  const onPlay = useOnPlay(songs);
  const router = useRouter();

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }
    return uploadModal.onOpen();
  };

  const handleLikedSongsClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    router.push('/favorites');
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between px-5 pt-4'>
        <div className='inline-flex items-center gap-x-2'>
          <MdLibraryMusic size={22} className='text-neutral-400' />
          <p className='font-bold text-sm text-neutral-400 hover:text-white cursor-default transition'>Your Library</p>
        </div>
        <AiOutlinePlus
          className='cursor-pointer text-neutral-400 hover:text-white hover:scale-105 active:scale-95 transition'
          onClick={onClick}
          size={18}
          title='Upload Song'
        />
      </div>

      {/* Spotify Library Filter Pills */}
      <div className='flex flex-wrap gap-2 px-5 mt-4'>
        <button className='px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800/80 text-white hover:bg-neutral-700/80 active:scale-95 transition duration-150'>
          Playlists
        </button>
        <button className='px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700/80 hover:text-white active:scale-95 transition duration-150'>
          Artists
        </button>
        <button className='px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700/80 hover:text-white active:scale-95 transition duration-150'>
          Albums
        </button>
      </div>

      {/* Library Search & Sort Row */}
      <div className='flex items-center justify-between px-5 mt-4 text-neutral-400 text-xs'>
        <div className='p-1.5 hover:bg-neutral-800 rounded-full cursor-pointer hover:text-white transition duration-150'>
          <BiSearch size={16} />
        </div>
        <div className='flex items-center gap-x-1.5 hover:text-white cursor-pointer transition duration-150 hover:scale-[1.02] active:scale-98'>
          <span>Recents</span>
          <HiListBullet size={16} />
        </div>
      </div>

      {/* Library Items List */}
      <div className='flex flex-col gap-y-1.5 mt-3 px-3 overflow-y-auto max-h-[380px]'>
        {/* Liked Songs Playlist Card */}
        <div
          onClick={handleLikedSongsClick}
          className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md transition duration-150'
        >
          <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-purple-900/10'>
            <AiFillHeart size={20} className='text-white' />
          </div>
          <div className='flex flex-col gap-y-0.5 overflow-hidden'>
            <p className='text-white font-semibold text-sm truncate'>Liked Songs</p>
            <p className='text-neutral-400 text-xs truncate flex items-center gap-x-1'>
              <span className='w-1 h-1 rounded-full bg-green-500' />
              <span>Playlist • Pin</span>
            </p>
          </div>
        </div>

        {/* Mock Playlists matching macOS Spotify layout */}
        <div className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md transition duration-150'>
          <div className='rounded-md min-h-[48px] min-w-[48px] bg-gradient-to-br from-teal-600 to-emerald-800 flex items-center justify-center font-bold text-white text-base shadow-md'>
            #6
          </div>
          <div className='flex flex-col gap-y-0.5 overflow-hidden'>
            <p className='text-white font-semibold text-sm truncate'>My Playlist #6</p>
            <p className='text-neutral-400 text-xs truncate'>Playlist • Akash</p>
          </div>
        </div>

        <div className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md transition duration-150'>
          <div className='rounded-md min-h-[48px] min-w-[48px] bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center font-bold text-white text-base shadow-md'>
            Ex
          </div>
          <div className='flex flex-col gap-y-0.5 overflow-hidden'>
            <p className='text-white font-semibold text-sm truncate'>Example</p>
            <p className='text-neutral-400 text-xs truncate'>Playlist • Akash</p>
          </div>
        </div>

        <div className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md transition duration-150'>
          <div className='rounded-md min-h-[48px] min-w-[48px] bg-gradient-to-br from-indigo-800 to-blue-900 flex items-center justify-center font-bold text-white text-base shadow-md'>
            GR
          </div>
          <div className='flex flex-col gap-y-0.5 overflow-hidden'>
            <p className='text-white font-semibold text-sm truncate'>GuideRealm</p>
            <p className='text-neutral-400 text-xs truncate'>Playlist • Akash</p>
          </div>
        </div>

        <div className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md transition duration-150'>
          <div className='rounded-md min-h-[48px] min-w-[48px] bg-gradient-to-br from-rose-700 to-pink-900 flex items-center justify-center font-bold text-white text-base shadow-md'>
            Hi
          </div>
          <div className='flex flex-col gap-y-0.5 overflow-hidden'>
            <p className='text-white font-semibold text-sm truncate'>Hi</p>
            <p className='text-neutral-400 text-xs truncate'>Playlist • Akash</p>
          </div>
        </div>

        <div className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md transition duration-150'>
          <div className='rounded-md min-h-[48px] min-w-[48px] bg-gradient-to-br from-purple-800 to-fuchsia-900 flex items-center justify-center font-bold text-white text-base shadow-md'>
            L
          </div>
          <div className='flex flex-col gap-y-0.5 overflow-hidden'>
            <p className='text-white font-semibold text-sm truncate'>Lol</p>
            <p className='text-neutral-400 text-xs truncate'>Playlist • Akash</p>
          </div>
        </div>

        {/* User uploaded or dynamically loaded songs */}
        {songs.map((song) => (
          <MediaItem
            onClick={(id: string) => onPlay(id)}
            key={song.id}
            data={song}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
