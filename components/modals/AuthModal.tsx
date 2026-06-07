'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { toast } from 'react-hot-toast';
import { FaSpotify } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

import useAuthModal from '@/hooks/useAuthModal';

import Modal from './Modal';

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const handleAnonLogin = async () => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: 'test@test.com',
      password: 'Password123',
    });

    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged In Anonymously');
    }
  };

  return (
    <Modal
      title=''
      description=''
      isOpen={isOpen}
      onChange={onChange}
    >
      <div className='flex flex-col items-center justify-center text-center -mt-6 mb-4 w-full'>
        {/* Spotify Logo */}
        <div className='text-[#1DB954] mb-4 hover:scale-105 transition duration-300'>
          <FaSpotify size={55} />
        </div>
        <h2 className='text-2xl font-bold text-white tracking-tight leading-tight'>
          Millions of songs.
        </h2>
        <h2 className='text-2xl font-bold text-white mb-6 tracking-tight leading-tight'>
          Free on Spotify.
        </h2>
        
        {/* Green "Log in" Pill with external link icon */}
        <button
          onClick={handleAnonLogin}
          className='w-full flex items-center justify-center gap-x-2 bg-[#1DB954] text-black font-bold text-base py-3.5 px-6 rounded-full hover:scale-[1.02] active:scale-[0.98] transition duration-150 hover:bg-[#1ed760] shadow-lg shadow-[#1db954]/10'
        >
          <span>Log in (Demo)</span>
          <FiExternalLink size={16} />
        </button>

        {/* Settings Button */}
        <button 
          onClick={() => toast.success("Settings: Audio quality set to 320kbps (Extreme)")}
          className='mt-4 text-xs text-neutral-400 hover:text-white flex items-center gap-x-1 hover:underline transition duration-150 font-medium'
        >
          Settings
        </button>
      </div>

      <div className='relative flex py-3 items-center w-full'>
        <div className='flex-grow border-t border-neutral-800'></div>
        <span className='flex-shrink mx-4 text-neutral-500 text-xs font-semibold uppercase tracking-wider'>or</span>
        <div className='flex-grow border-t border-neutral-800'></div>
      </div>

      <div className='mt-2'>
        <Auth
          theme='dark'
          providers={['github']}
          magicLink
          supabaseClient={supabaseClient}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                borderRadius: '9999px',
                borderColor: 'transparent',
                backgroundColor: '#282828',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                padding: '10px 20px',
              },
              input: {
                borderRadius: '8px',
                borderColor: '#2e2e2e',
                backgroundColor: '#1f1f1f',
                fontSize: '14px',
                padding: '12px',
              },
              label: {
                fontSize: '12px',
                color: '#b3b3b3',
                marginBottom: '4px',
              },
            },
            variables: {
              default: {
                colors: {
                  brand: '#1DB954',
                  brandAccent: '#1ed760',
                },
              },
            },
          }}
        />
      </div>
    </Modal>
  );
};

export default AuthModal;
