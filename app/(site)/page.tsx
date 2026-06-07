import getSongs from '@/actions/getSongs';

import Header from '@/components/Header';
import ListItem from '@/components/ListItem';
import PageContent from '@/app/(site)/components/PageContent';
import Welcome from '@/app/(site)/components/Welcome';
import { PUBLIC_SONGS } from '@/libs/musicApi';

export const revalidate = 0;

const Home = async () => {
  const localSongs = await getSongs();

  return (
    <div
      className='bg-neutral-900 rounded-lg h-full overflow-hidden overflow-y-auto 
      md:mr-2'
    >
      <Header>
        <div className='mb-2'>
          <Welcome />
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4'>
            <ListItem
              image='/images/liked.png'
              name='Favorites'
              href='favorites'
            />
          </div>
        </div>
      </Header>
      <div className='mt-2 mb-7 px-6 flex flex-col gap-y-8'>
        {localSongs.length > 0 && (
          <div>
            <div className='flex justify-between items-center '>
              <h1 className='text-white text-2xl font-semibold'>Your Uploads</h1>
            </div>
            <PageContent songs={localSongs} />
          </div>
        )}
        
        <div>
          <div className='flex justify-between items-center '>
            <h1 className='text-white text-2xl font-semibold'>Akash&apos;s Favorites</h1>
          </div>
          <PageContent songs={PUBLIC_SONGS} />
        </div>
      </div>
    </div>
  );
};

export default Home;
