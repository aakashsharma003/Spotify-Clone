'use client';

import Image from 'next/image';
import usePlayer from '@/hooks/usePlayer';
import useGetSongById from '@/hooks/useGetSongById';
import useLoadImage from '@/hooks/useLoadImage';

const RightSidebar = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imageUrl = useLoadImage(song!);

  if (!player.activeId || !song) {
    return (
      <div className='hidden lg:flex flex-col gap-y-4 bg-black h-full w-[300px] p-4 border-l border-neutral-800'>
        <h2 className='text-white font-semibold text-lg'>Now Playing</h2>
        <div className='text-neutral-400 text-sm'>No song currently playing.</div>
      </div>
    );
  }

  return (
    <div className='hidden lg:flex flex-col gap-y-4 bg-black h-full w-[300px] p-4 border-l border-neutral-800'>
      <h2 className='text-white font-semibold text-lg'>Now Playing</h2>
      <div className='relative w-full aspect-square rounded-md overflow-hidden bg-neutral-800 mt-4'>
        <Image
          src={imageUrl || '/images/liked.png'}
          alt='Now Playing'
          fill
          className='object-cover'
        />
      </div>
      <div className='flex flex-col mt-2'>
        <h3 className='text-white font-bold text-xl truncate'>{song.title}</h3>
        <p className='text-neutral-400 text-sm truncate'>{song.artist}</p>
      </div>
    </div>
  );
};

export default RightSidebar;
