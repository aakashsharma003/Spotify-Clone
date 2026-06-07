'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { twMerge } from 'tailwind-merge';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { FiBell, FiUsers } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import usePlayer from '@/hooks/usePlayer';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import useGetSongById from '@/hooks/useGetSongById';
import useLoadImage from '@/hooks/useLoadImage';

import Button from './Button';

interface HeaderProps extends PropsWithChildren {
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imageUrl = useLoadImage(song!);

  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user, subscription } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged Out');
    }
  };

  const handlePremiumClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    if (subscription) {
      toast.success('You are already a Premium member! 🚀');
    } else {
      subscribeModal.onOpen();
    }
  };

  const handleBellClick = () => {
    toast.success("No new notifications. You're all caught up! 🔔");
  };

  const handleFriendsClick = () => {
    toast.success("Friend Activity panel is coming soon! 👥");
  };

  return (
    <div
      className={twMerge(
        `sticky top-0 z-30 bg-neutral-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex flex-col h-fit relative overflow-hidden transition-all duration-500`,
        className,
      )}
    >
      {imageUrl && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-in-out opacity-25 scale-105 filter blur-md"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className='w-full flex items-center justify-between relative z-10'>
        {/* Navigation Arrows */}
        <div className='hidden md:flex gap-x-2 items-center'>
          <button
            className='rounded-full bg-black/70 flex items-center justify-center 
            cursor-pointer hover:bg-neutral-800 transition duration-200'
            onClick={() => router.back()}
          >
            <RxCaretLeft size={30} className='text-neutral-200' />
          </button>
          <button
            className='rounded-full bg-black/70 flex items-center justify-center 
            cursor-pointer hover:bg-neutral-800 transition duration-200'
            onClick={() => router.forward()}
          >
            <RxCaretRight size={30} className='text-neutral-200' />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className='flex md:hidden gap-x-2 items-center'>
          <Link href={'/'}>
            <button
              className='rounded-full p-2 bg-white flex items-center 
            justify-center hover:opacity-75 transition'
            >
              <HiHome className='text-black' size={20} />
            </button>
          </Link>
          <Link href={'/search'}>
            <button
              className='rounded-full p-2 bg-white flex items-center 
            justify-center hover:opacity-75 transition'
            >
              <BiSearch className='text-black' size={20} />
            </button>
          </Link>
        </div>

        {/* Action Controls */}
        <div className='flex justify-between items-center gap-x-3.5'>
          <div className='flex gap-x-3 items-center'>
            {/* Premium Pill Button */}
            <button
              onClick={handlePremiumClick}
              className='hidden sm:block bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition duration-150'
            >
              Premium Active
            </button>

            {/* Bell Notification Icon */}
            <button
              onClick={handleBellClick}
              className='p-2 rounded-full bg-black/60 text-neutral-400 hover:text-white hover:scale-105 active:scale-95 transition duration-150 border border-neutral-800'
              title="What's New"
            >
              <FiBell size={16} />
            </button>

            {/* Friend Activity Icon */}
            <button
              onClick={handleFriendsClick}
              className='p-2 rounded-full bg-black/60 text-neutral-400 hover:text-white hover:scale-105 active:scale-95 transition duration-150 border border-neutral-800'
              title='Friend Activity'
            >
              <FiUsers size={16} />
            </button>

            {/* Profile Avatar / Account Settings */}
            <button
              onClick={() => router.push('/account')}
              className='flex items-center gap-x-2 px-3 py-1.5 rounded-full bg-black/60 text-neutral-200 hover:text-white hover:scale-105 active:scale-95 transition duration-150 border border-neutral-800 font-semibold text-xs'
              title='Profile'
            >
              <FaUserAlt size={12} className='text-neutral-400' />
              <span>Akash Sharma</span>
            </button>
          </div>
        </div>
      </div>
      <div className='mt-4 relative z-10'>{children}</div>
    </div>
  );
};

export default Header;
