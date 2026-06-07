import { Song } from '@/types';

export const PUBLIC_SONGS: Song[] = [
  {
    id: 'public-heros-come-back',
    user_id: 'public-user',
    artist: 'Naruto Shippuden',
    title: "Opening 1 - Hero's Come Back",
    song_path: "/songs/Naruto Shippuden - Opening 1  Hero's Come Back.mp3",
    image_path: "/shipuden-poster.jpg"
  },
  {
    id: 'public-sadness-and-sorrow',
    user_id: 'public-user',
    artist: 'Naruto Soundtrack',
    title: 'Sadness and Sorrow (Full Version)',
    song_path: '/songs/Naruto Soundtrack- Sadness and Sorrow (FULL VERSION).mp3',
    image_path: '/sadness-and-sorrow.jpg'
  }
];

export interface JioSaavnImage {
  quality: string;
  link: string;
  url?: string;
}

export interface JioSaavnDownloadUrl {
  quality: string;
  link: string;
  url?: string;
}

export interface JioSaavnSong {
  id: string;
  name: string;
  year?: string;
  duration?: string | number;
  language?: string;
  playCount?: string | number;
  primaryArtists?: string | any[];
  artists?: {
    primary?: Array<{ name: string }>;
  };
  image: JioSaavnImage[];
  downloadUrl: JioSaavnDownloadUrl[];
}

const BASE_URL = 'https://saavn.sumit.co/api';

// ── In-memory cache with TTL ──
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const apiCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();

function getCached<T>(key: string): T | null {
  const entry = apiCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  if (entry) apiCache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  apiCache.set(key, { data, timestamp: Date.now() });
}

// Deduplicates in-flight requests for the same key
async function deduplicatedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) return cached;

  const existing = inFlightRequests.get(key);
  if (existing) return existing;

  const promise = fetcher().then(result => {
    setCache(key, result);
    inFlightRequests.delete(key);
    return result;
  }).catch(err => {
    inFlightRequests.delete(key);
    throw err;
  });

  inFlightRequests.set(key, promise);
  return promise;
}

function decodeHTMLEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

function getBestImage(images: JioSaavnImage[]): string {
  if (!images || images.length === 0) return 'https://picsum.photos/300/300';
  const best = images.find(i => i.quality === '500x500') || images[images.length - 1];
  return best.link || best.url || 'https://picsum.photos/300/300';
}

function getBestAudio(urls: JioSaavnDownloadUrl[]): string {
  if (!urls || urls.length === 0) return '';
  const best = urls.find(u => u.quality === '320kbps')
    || urls.find(u => u.quality === '160kbps')
    || urls.find(u => u.quality === '96kbps')
    || urls[urls.length - 1];
  return best.link || best.url || '';
}

export function mapToSong(raw: JioSaavnSong): Song {
  let artistName = 'Unknown';
  if (typeof raw.primaryArtists === 'string') {
    artistName = raw.primaryArtists;
  } else if (Array.isArray(raw.primaryArtists)) {
    artistName = raw.primaryArtists.map((a: any) => typeof a === 'string' ? a : a.name).join(', ');
  } else if (raw.artists?.primary) {
    artistName = raw.artists.primary.map((a: any) => a.name).join(', ');
  }

  return {
    id: raw.id,
    user_id: 'jiosaavn',
    title: decodeHTMLEntities(raw.name),
    artist: decodeHTMLEntities(artistName),
    image_path: getBestImage(raw.image),
    song_path: getBestAudio(raw.downloadUrl),
  };
}

export async function searchSongs(query: string, limit: number = 20): Promise<Song[]> {
  if (!query) return [];
  const cacheKey = `search:${query}:${limit}`;

  return deduplicatedFetch(cacheKey, async () => {
    try {
      const matchingPublic = PUBLIC_SONGS.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.artist.toLowerCase().includes(query.toLowerCase())
      );

      const res = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
      const json = await res.json();
      let apiSongs: Song[] = [];
      if (json.success && json.data?.results) {
        apiSongs = json.data.results.map(mapToSong);
      }
      return [...matchingPublic, ...apiSongs];
    } catch (e) {
      console.warn('[musicApi] searchSongs error:', e);
      return [];
    }
  });
}

export async function getSongDetails(songId: string): Promise<Song | null> {
  const cacheKey = `song:${songId}`;

  return deduplicatedFetch(cacheKey, async () => {
    try {
      const publicSong = PUBLIC_SONGS.find(s => s.id === songId);
      if (publicSong) return publicSong;

      const res = await fetch(`${BASE_URL}/songs?ids=${songId}`);
      const json = await res.json();
      if (json.success && json.data?.length > 0) {
        return mapToSong(json.data[0]);
      }
      return null;
    } catch (e) {
      console.warn('[musicApi] getSongDetails error:', e);
      return null;
    }
  });
}

